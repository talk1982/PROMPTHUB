import React, { useState } from 'react';
import { Prompt, Tag } from '../types';
import { CloseIcon, TagIcon, ChevronDownIcon, ChevronRightIcon } from './icons';

// A helper component for rendering the tag selection tree
interface TagSelectionTreeProps {
    tags: Tag[];
    selectedTagIds: Set<string>;
    onTagToggle: (tagId: string) => void;
    level?: number;
}

const TagSelectionTree: React.FC<TagSelectionTreeProps> = ({ tags, selectedTagIds, onTagToggle, level = 0 }) => {
    const [openTags, setOpenTags] = useState<Set<string>>(new Set());

    const handleParentTagClick = (tagId: string) => {
        setOpenTags(prev => {
            const newOpenTags = new Set(prev);
            newOpenTags.has(tagId) ? newOpenTags.delete(tagId) : newOpenTags.add(tagId);
            return newOpenTags;
        });
    };

    return (
        <ul className="space-y-1">
            {tags.map(tag => (
                <li key={tag.id}>
                    <div className="flex items-center" style={{ paddingLeft: `${level * 1.5}rem` }}>
                        {tag.children && tag.children.length > 0 && (
                             <button type="button" onClick={() => handleParentTagClick(tag.id)} className="mr-1 p-1 rounded-full hover:bg-primary">
                                {openTags.has(tag.id) ? <ChevronDownIcon className="h-4 w-4"/> : <ChevronRightIcon className="h-4 w-4"/>}
                            </button>
                        )}
                        <label className="flex items-center p-2 rounded-md transition-colors duration-150 cursor-pointer hover:bg-primary flex-grow">
                             <input
                                type="checkbox"
                                checked={selectedTagIds.has(tag.id)}
                                onChange={() => onTagToggle(tag.id)}
                                className="h-4 w-4 rounded bg-primary border-secondary text-accent focus:ring-accent"
                             />
                             <TagIcon className="h-4 w-4 mx-2 flex-shrink-0" />
                             <span className="text-sm">{tag.name}</span>
                        </label>
                    </div>
                    {tag.children && openTags.has(tag.id) && (
                        <TagSelectionTree
                            tags={tag.children}
                            selectedTagIds={selectedTagIds}
                            onTagToggle={onTagToggle}
                            level={level + 1}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
};


interface AddPromptModalProps {
    isOpen: boolean;
    allTags: Tag[];
    onClose: () => void;
    onSave: (prompt: Prompt) => void;
}

const initialPromptState: Omit<Prompt, 'id' | 'createdAt' | 'author'> = {
    title: '',
    promptText: '',
    aiModel: '',
    tags: [],
    isPublic: true,
    sampleResult: {
        type: 'text',
        content: ''
    }
};


const AddPromptModal: React.FC<AddPromptModalProps> = ({ isOpen, allTags, onClose, onSave }) => {
    const [formData, setFormData] = useState(initialPromptState);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name.startsWith('sampleResult.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                sampleResult: { ...(prev.sampleResult || { type: 'text', content: '' }), [field]: value }
            }));
        } else {
             setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
            }));
        }
    };
    
    const handleTagToggle = (tagId: string) => {
        setFormData(prev => {
            const newTags = new Set(prev.tags);
            if (newTags.has(tagId)) {
                newTags.delete(tagId);
            } else {
                newTags.add(tagId);
            }
            return { ...prev, tags: Array.from(newTags) };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPrompt: Prompt = {
            ...formData,
            id: `p${Date.now()}`, // Simple unique ID generation
            createdAt: new Date().toISOString(),
            author: 'CurrentUser' // Hardcoded for simplicity
        };
        onSave(newPrompt);
        setFormData(initialPromptState); // Reset form
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-primary rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-secondary flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-text-primary">Add New Prompt</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                        <CloseIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </div>

                <form id="add-prompt-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full bg-secondary border border-secondary/50 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent transition" required />
                        </div>
                        <div>
                            <label htmlFor="promptText" className="block text-sm font-medium text-text-secondary mb-1">Prompt Text</label>
                            <textarea name="promptText" id="promptText" value={formData.promptText} onChange={handleChange} rows={8} className="w-full bg-secondary border border-secondary/50 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent transition" required></textarea>
                        </div>
                        <div>
                            <label htmlFor="aiModel" className="block text-sm font-medium text-text-secondary mb-1">AI Model</label>
                            <input type="text" name="aiModel" id="aiModel" value={formData.aiModel} onChange={handleChange} className="w-full bg-secondary border border-secondary/50 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent transition" required />
                        </div>
                        <div className="flex items-center justify-between bg-secondary p-3 rounded-lg">
                           <label htmlFor="isPublic" className="text-sm font-medium text-text-primary">Make Public</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="isPublic" id="isPublic" checked={formData.isPublic} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-accent/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                        <div>
                             <h4 className="block text-sm font-medium text-text-secondary mb-2">Tags</h4>
                             <div className="bg-secondary p-3 rounded-lg max-h-60 overflow-y-auto">
                                <TagSelectionTree tags={allTags} selectedTagIds={new Set(formData.tags)} onTagToggle={handleTagToggle} />
                             </div>
                        </div>
                        <div>
                            <h4 className="block text-sm font-medium text-text-secondary mb-2">Sample Result (Optional)</h4>
                            <div className="bg-secondary p-4 rounded-lg flex flex-col gap-4">
                                <select name="sampleResult.type" value={formData.sampleResult?.type || 'text'} onChange={handleChange} className="w-full bg-primary border border-secondary/50 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent transition">
                                    <option value="text">Text</option>
                                    <option value="image">Image URL</option>
                                </select>
                                <textarea name="sampleResult.content" placeholder={formData.sampleResult?.type === 'image' ? "https://..." : "Sample text result..."} value={formData.sampleResult?.content || ''} onChange={handleChange} rows={4} className="w-full bg-primary border border-secondary/50 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent transition"></textarea>
                            </div>
                        </div>
                    </div>
                </form>

                 <div className="p-6 border-t border-secondary flex justify-end items-center space-x-4 flex-shrink-0">
                    <button type="button" onClick={onClose} className="bg-secondary hover:bg-secondary/70 text-text-primary font-bold py-2 px-6 rounded-lg transition-colors">
                        Cancel
                    </button>
                     <button type="submit" form="add-prompt-form" className="bg-accent hover:bg-sky-400 text-primary font-bold py-2 px-6 rounded-lg transition-colors">
                        Save Prompt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPromptModal;
