import React, { useState } from 'react';
import { Case } from '../../types';
import { XIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseData: Omit<Case, 'id' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const InputField: React.FC<{id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, placeholder?: string}> = 
  ({ id, label, value, onChange, required, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-dark-text-secondary mb-1">{label}</label>
        <input
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-dark-text placeholder-gray-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm rounded-md"
        />
    </div>
);

const NewCaseModal: React.FC<NewCaseModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    await onSubmit({
        title,
        description,
        category,
        tags: tagsArray
    });

    setIsSubmitting(false);
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setTags('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-dark-card rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-dark-text">Nouveau Dossier d'Enquête</h2>
          <button onClick={onClose} className="text-dark-text-secondary hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-4">
            <InputField id="title" label="Titre du dossier" value={title} onChange={(e) => setTitle(e.target.value)} required />
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-dark-text-secondary mb-1">Description</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-dark-text placeholder-gray-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm rounded-md"
              ></textarea>
            </div>

            <InputField id="category" label="Catégorie" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <InputField id="tags" label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="séparés par des virgules" />
          </div>
        </form>
         <div className="flex justify-end items-center p-4 border-t border-gray-700 bg-gray-800/50 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-dark-text-secondary rounded-md hover:bg-gray-700 mr-2">
                Annuler
            </button>
            <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center w-40 px-4 py-2 bg-brand-lightblue text-white text-sm font-medium rounded-md hover:bg-brand-blue disabled:bg-gray-600"
            >
                {isSubmitting ? <Spinner size={20} /> : "Créer le dossier"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default NewCaseModal;
