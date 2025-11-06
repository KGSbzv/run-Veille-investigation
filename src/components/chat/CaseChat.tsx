import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Message, MessageRole } from '../../types';
import { getMessagesForCase, addMessage, getRAGContextForQuery } from '../../services/mockDataService';
import { streamChatResponse, generateReport } from '../../services/geminiService';
import { SendIcon, UserIcon, BotIcon, FileTextIcon, CopyIcon, CheckIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';

const ReportMessage: React.FC<{ content: string }> = ({ content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <FileTextIcon className="w-5 h-5 text-brand-accent" />
                    <h3 className="font-semibold text-dark-text">Rapport de Synthèse</h3>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-brand-lightblue text-white rounded-md hover:bg-brand-blue transition-colors disabled:opacity-50"
                >
                    {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                    {copied ? 'Copié !' : 'Copier'}
                </button>
            </div>
            <div className="prose prose-sm prose-invert max-w-none prose-p:text-dark-text-secondary prose-headings:text-dark-text">
                <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
            </div>
        </div>
    );
}

const ChatMessage: React.FC<{ message: Message; onToggleSelect: (id: string) => void }> = ({ message, onToggleSelect }) => {
    const isSelectable = !message.isReport;

    return (
      <div className={`flex items-start gap-3 group ${message.role === MessageRole.USER ? 'justify-end' : ''}`}>
        {message.role === MessageRole.ASSISTANT && (
          <div className="w-8 h-8 flex-shrink-0 bg-brand-lightblue rounded-full flex items-center justify-center">
            <BotIcon className="w-5 h-5 text-white" />
          </div>
        )}

        <div className={`flex items-center gap-2 ${message.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}>
            {isSelectable && (
                 <input
                    type="checkbox"
                    checked={!!message.isSelected}
                    onChange={() => onToggleSelect(message.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity form-checkbox h-4 w-4 bg-gray-700 border-gray-500 text-brand-accent rounded focus:ring-brand-accent"
                />
            )}
           
            <div className={`max-w-xl p-3 rounded-lg ${message.role === MessageRole.USER ? 'bg-brand-lightblue text-white' : 'bg-gray-700 text-dark-text'}`}>
                 {message.isReport ? <ReportMessage content={message.content} /> : <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
            </div>
        </div>
        

        {message.role === MessageRole.USER && (
          <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    );
};


const CaseChat: React.FC<{ caseId: string; caseTitle: string }> = ({ caseId, caseTitle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedMessages = useMemo(() => messages.filter(m => m.isSelected), [messages]);

  useEffect(() => {
    const loadMessages = async () => {
        setIsLoading(true);
        const caseMessages = await getMessagesForCase(caseId);
        setMessages(caseMessages);
        setIsLoading(false);
    };
    loadMessages();
  }, [caseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggleSelect = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isSelected: !m.isSelected } : m));
  };
  
  const handleGenerateReport = async () => {
    if (selectedMessages.length === 0) return;
    setIsGeneratingReport(true);
    const reportContent = await generateReport(caseTitle, selectedMessages);
    
    await addMessage(caseId, {
        role: MessageRole.ASSISTANT,
        content: reportContent,
        isReport: true,
    });
    const updatedMessages = await getMessagesForCase(caseId);
    setMessages(updatedMessages.map(m => ({...m, isSelected: false })));
    
    setIsGeneratingReport(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isGeneratingReport) return;

    const historyForGemini = [...messages];
    const userMessageContent = input;
    
    setInput('');
    setIsLoading(true);

    await addMessage(caseId, { role: MessageRole.USER, content: userMessageContent });
    
    try {
        const ragContext = await getRAGContextForQuery(userMessageContent);
        
        const assistantResponse = await addMessage(caseId, { role: MessageRole.ASSISTANT, content: "" });
        
        const allMessages = await getMessagesForCase(caseId);
        setMessages(allMessages);
        
        const stream = await streamChatResponse(historyForGemini, userMessageContent, ragContext);
        
        let fullResponse = "";
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            fullResponse += chunkText;
            setMessages(prev => prev.map(msg => 
                msg.id === assistantResponse.id ? { ...msg, content: fullResponse } : msg
            ));
        }
    } catch (error) {
        console.error("Error streaming chat response:", error);
        await addMessage(caseId, { role: MessageRole.ASSISTANT, content: "Désolé, une erreur est survenue." });
        const finalMessages = await getMessagesForCase(caseId);
        setMessages(finalMessages);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-dark-card border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => <ChatMessage key={message.id} message={message} onToggleSelect={handleToggleSelect} />)}
        {isLoading && !isGeneratingReport && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 flex-shrink-0 bg-brand-lightblue rounded-full flex items-center justify-center"> <BotIcon className="w-5 h-5 text-white" /> </div>
             <div className="max-w-xl p-3 rounded-lg bg-gray-700 text-dark-text"> <Spinner size={20} /> </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        {selectedMessages.length > 0 && (
            <div className="mb-2 p-2 bg-gray-800 rounded-md flex justify-between items-center">
                <span className="text-sm text-dark-text-secondary">{selectedMessages.length} message(s) sélectionné(s)</span>
                <button 
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-brand-accent text-dark-bg font-semibold rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-wait">
                   {isGeneratingReport ? <Spinner size={16}/> : <FileTextIcon className="w-4 h-4" />}
                   {isGeneratingReport ? 'Génération...' : 'Générer un rapport'}
                </button>
            </div>
        )}
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question à l'assistant..."
            className="flex-1 bg-gray-800 border border-gray-600 text-dark-text rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
            disabled={isLoading || isGeneratingReport}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || isGeneratingReport}
            className="p-2 bg-brand-lightblue rounded-lg text-white hover:bg-brand-blue disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CaseChat;