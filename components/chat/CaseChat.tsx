
import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageRole } from '../../types';
import { getRAGContextForQuery } from '../../services/mockDataService';
import { streamChatResponse } from '../../services/geminiService';
import { SendIcon, UserIcon, BotIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';

const CaseChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: MessageRole.ASSISTANT, content: "Bonjour, je suis votre assistant d'enquête. Comment puis-je vous aider aujourd'hui ?", timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const ragContext = await getRAGContextForQuery(input);
        
        const assistantMessageId = (Date.now() + 1).toString();
        
        setMessages(prev => [
            ...prev,
            { id: assistantMessageId, role: MessageRole.ASSISTANT, content: "", timestamp: new Date().toISOString() }
        ]);
        
        const stream = await streamChatResponse(messages, input, ragContext);
        
        let fullResponse = "";
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            fullResponse += chunkText;
            setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg
            ));
        }
    } catch (error) {
        console.error("Error streaming chat response:", error);
        setMessages(prev => [
            ...prev,
            { id: (Date.now() + 1).toString(), role: MessageRole.ASSISTANT, content: "Désolé, une erreur est survenue.", timestamp: new Date().toISOString() }
        ]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-dark-card border border-gray-700 rounded-lg overflow-hidden" data-tour="chat">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.role === MessageRole.USER ? 'justify-end' : ''}`}>
            {message.role === MessageRole.ASSISTANT && (
                <div className="w-8 h-8 flex-shrink-0 bg-brand-lightblue rounded-full flex items-center justify-center">
                    <BotIcon className="w-5 h-5 text-white" />
                </div>
            )}
            <div className={`max-w-xl p-3 rounded-lg ${message.role === MessageRole.USER ? 'bg-brand-lightblue text-white' : 'bg-gray-700 text-dark-text'}`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
             {message.role === MessageRole.USER && (
                <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                </div>
            )}
          </div>
        ))}
         {isLoading && messages[messages.length-1].role === MessageRole.ASSISTANT && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 flex-shrink-0 bg-brand-lightblue rounded-full flex items-center justify-center">
                <BotIcon className="w-5 h-5 text-white" />
             </div>
             <div className="max-w-xl p-3 rounded-lg bg-gray-700 text-dark-text">
                <Spinner size={20} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question à l'assistant..."
            className="flex-1 bg-gray-800 border border-gray-600 text-dark-text rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
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
