import React, { useState } from 'react';
import { Prompt, Tag } from '../types';
import { CloseIcon } from './icons';

interface AddPromptModalProps {
    onClose: () => void;
    onAddPrompt: (newPrompt: Omit<Prompt, 'id' | 'author' | 'createdAt'>) => void;
    tags: Tag[];
}

const AddPromptModal: React.FC<AddPromptModalProps> = ({ onClose, onAddPrompt, tags }) => {
    const [title, setTitle] = useState('');
    const [promptText, setPromptText] = useState('');
    const [aiModel, setAiModel] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !promptText || !aiModel) return;
        onAddPrompt({
            title,
            promptText,
            aiModel,
            tags: selectedTagIds,
            isPublic
        });
    };

    const handleTagChange = (tagId: string) => {
        setSelectedTagIds(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-primary rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-secondary flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-text-primary">Add New Prompt</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                        <CloseIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-secondary border border-secondary/50 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                        <label htmlFor="promptText" className="block text-sm font-medium text-text-primary mb-1">Prompt Text</label>
                        <textarea id="promptText" value={promptText} onChange={e => setPromptText(e.target.value)} required rows={6} className="w-full bg-secondary border border-secondary/50 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
                    </div>
                    <div>
                        <label htmlFor="aiModel" className="block text-sm font-medium text-text-primary mb-1">AI Model</label>
                        <input type="text" id="aiModel" value={aiModel} onChange={e => setAiModel(e.target.value)} required className="w-full bg-secondary border border-secondary/50 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Tags</label>
                        <div className="max-h-40 overflow-y-auto bg-secondary p-2 rounded-lg space-y-2">
                            {tags.map(tag => (
                                <div key={tag.id}>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={selectedTagIds.includes(tag.id)} onChange={() => handleTagChange(tag.id)} className="form-checkbox h-4 w-4 text-accent bg-secondary border-secondary/50 rounded focus:ring-accent"/>
                                        <span>{tag.name}</span>
                                    </label>
                                    {tag.children && (
                                        <div className="ml-6 mt-1 space-y-1">
                                            {tag.children.map(child => (
                                                 <label key={child.id} className="flex items-center space-x-2 cursor-pointer">
                                                    <input type="checkbox" checked={selectedTagIds.includes(child.id)} onChange={() => handleTagChange(child.id)} className="form-checkbox h-4 w-4 text-accent bg-secondary border-secondary/50 rounded focus:ring-accent"/>
                                                    <span>{child.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-text-primary">Visibility</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="visibility" checked={isPublic} onChange={() => setIsPublic(true)} className="form-radio h-4 w-4 text-accent bg-secondary border-secondary/50 focus:ring-accent"/>
                                <span className="ml-2">Public</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="visibility" checked={!isPublic} onChange={() => setIsPublic(false)} className="form-radio h-4 w-4 text-accent bg-secondary border-secondary/50 focus:ring-accent"/>
                                <span className="ml-2">Private</span>
                            </label>
                        </div>
                    </div>
                </form>
                <div className="p-6 border-t border-secondary flex justify-end items-center space-x-4">
                    <button type="button" onClick={onClose} className="bg-secondary hover:bg-secondary/70 text-text-primary font-bold py-2 px-6 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="bg-accent hover:bg-sky-400 text-primary font-bold py-2 px-6 rounded-lg transition-colors">Add Prompt</button>
                </div>
            </div>
        </div>
    );
};

export default AddPromptModal;
