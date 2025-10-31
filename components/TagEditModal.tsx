import React, { useState } from 'react';
import { Tag } from '../types';
import { CloseIcon, TrashIcon } from './icons';

interface TagEditModalProps {
    tags: Tag[];
    onClose: () => void;
    onSave: (updatedTags: Tag[]) => void;
}

const TagEditModal: React.FC<TagEditModalProps> = ({ tags, onClose, onSave }) => {
    const [editableTags, setEditableTags] = useState<Tag[]>(JSON.parse(JSON.stringify(tags)));
    const [newTagName, setNewTagName] = useState('');

    const handleSave = () => {
        onSave(editableTags);
    };

    const handleAddTag = () => {
        if (!newTagName.trim()) return;
        const newTag: Tag = {
            id: `tag-${Date.now()}`,
            name: newTagName.trim(),
            children: [],
        };
        setEditableTags([...editableTags, newTag]);
        setNewTagName('');
    };

    const handleDeleteTag = (tagId: string) => {
        const filterTags = (tagList: Tag[]): Tag[] => {
            return tagList.filter(tag => tag.id !== tagId).map(tag => {
                if (tag.children) {
                    return { ...tag, children: filterTags(tag.children) };
                }
                return tag;
            });
        };
        setEditableTags(filterTags(editableTags));
    };
    
    const handleTagNameChange = (tagId: string, newName: string) => {
        const updateTags = (tagList: Tag[]): Tag[] => {
            return tagList.map(tag => {
                if (tag.id === tagId) {
                    return { ...tag, name: newName };
                }
                if (tag.children) {
                    return { ...tag, children: updateTags(tag.children) };
                }
                return tag;
            });
        };
        setEditableTags(updateTags(editableTags));
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-primary rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-secondary flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-text-primary">Manage Tags</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                        <CloseIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="space-y-2">
                        {editableTags.map(tag => (
                            <div key={tag.id} className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={tag.name}
                                    onChange={(e) => handleTagNameChange(tag.id, e.target.value)}
                                    className="flex-grow bg-secondary border border-secondary/50 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                                <button onClick={() => handleDeleteTag(tag.id)} className="p-2 rounded-full hover:bg-secondary text-text-secondary hover:text-red-500 transition-colors">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-secondary">
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder="New tag name"
                            className="flex-grow bg-secondary border border-secondary/50 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <button onClick={handleAddTag} className="bg-accent hover:bg-sky-400 text-primary font-bold py-2 px-4 rounded-lg transition-colors">
                            Add
                        </button>
                    </div>
                </div>
                <div className="p-6 border-t border-secondary flex justify-end items-center space-x-4">
                    <button type="button" onClick={onClose} className="bg-secondary hover:bg-secondary/70 text-text-primary font-bold py-2 px-6 rounded-lg transition-colors">Cancel</button>
                    <button type="button" onClick={handleSave} className="bg-accent hover:bg-sky-400 text-primary font-bold py-2 px-6 rounded-lg transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};

export default TagEditModal;
