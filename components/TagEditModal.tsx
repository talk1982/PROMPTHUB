import React, { useState, useEffect } from 'react';
import { Tag } from '../types';
import { CloseIcon, PlusIcon, TrashIcon, EditIcon } from './icons';

interface TagEditModalProps {
    isOpen: boolean;
    tags: Tag[];
    onClose: () => void;
    onSave: (tags: Tag[]) => void;
}

const TagEditModal: React.FC<TagEditModalProps> = ({ isOpen, tags, onClose, onSave }) => {
    const [editableTags, setEditableTags] = useState<Tag[]>([]);
    const [editingTag, setEditingTag] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Deep copy tags to avoid mutating original state
            setEditableTags(JSON.parse(JSON.stringify(tags)));
        }
    }, [isOpen, tags]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(editableTags);
        onClose();
    };
    
    const findTagAndParent = (tagsToSearch: Tag[], tagId: string, parent: Tag | null = null): {tag: Tag | null, parent: Tag | null} => {
        for (const tag of tagsToSearch) {
            if (tag.id === tagId) return { tag, parent };
            if (tag.children) {
                const found = findTagAndParent(tag.children, tagId, tag);
                if (found.tag) return found;
            }
        }
        return { tag: null, parent: null };
    };

    const handleAddTag = (parentId: string | null = null) => {
        const newTag: Tag = { id: `tag-${Date.now()}`, name: 'New Tag' };
        
        setEditableTags(currentTags => {
            const newTags = JSON.parse(JSON.stringify(currentTags));
            if (parentId === null) {
                newTags.push(newTag);
            } else {
                 const { tag: parent } = findTagAndParent(newTags, parentId);
                 if (parent) {
                     if (!parent.children) parent.children = [];
                     parent.children.push(newTag);
                 }
            }
            return newTags;
        });
    };

    const handleDeleteTag = (tagId: string) => {
         setEditableTags(currentTags => {
            const newTags = JSON.parse(JSON.stringify(currentTags));
            const { parent } = findTagAndParent(newTags, tagId);
            const targetArray = parent ? parent.children : newTags;
            const tagIndex = targetArray?.findIndex(t => t.id === tagId);
            if(targetArray && tagIndex !== undefined && tagIndex > -1){
                targetArray.splice(tagIndex, 1);
            }
            return newTags;
        });
    };
    
    const handleStartEditing = (tag: Tag) => {
        setEditingTag({ id: tag.id, name: tag.name });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingTag) {
            setEditingTag({ ...editingTag, name: e.target.value });
        }
    };
    
    const handleFinishEditing = () => {
        if (!editingTag || !editingTag.name.trim()) {
            setEditingTag(null);
            return;
        };
        setEditableTags(currentTags => {
            const newTags = JSON.parse(JSON.stringify(currentTags));
            const { tag } = findTagAndParent(newTags, editingTag.id);
            if (tag) {
                tag.name = editingTag.name.trim();
            }
            return newTags;
        });
        setEditingTag(null);
    };

    const renderTagEditor = (tagsToRender: Tag[], level = 0): React.ReactNode => {
        return (
            <ul className="space-y-2">
                {tagsToRender.map(tag => (
                    <li key={tag.id}>
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-secondary/50" style={{ paddingLeft: `${level * 1.5}rem` }}>
                             {editingTag?.id === tag.id ? (
                                <input
                                    type="text"
                                    value={editingTag.name}
                                    onChange={handleNameChange}
                                    onBlur={handleFinishEditing}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFinishEditing()}
                                    className="bg-primary border border-accent rounded px-2 py-1 text-sm flex-grow"
                                    autoFocus
                                />
                            ) : (
                                <span className="text-sm flex-grow">{tag.name}</span>
                            )}
                            <button onClick={() => handleStartEditing(tag)} className="p-1 text-text-secondary hover:text-accent"><EditIcon className="h-4 w-4"/></button>
                            <button onClick={() => handleAddTag(tag.id)} className="p-1 text-text-secondary hover:text-green-400"><PlusIcon className="h-4 w-4"/></button>
                            <button onClick={() => handleDeleteTag(tag.id)} className="p-1 text-text-secondary hover:text-red-400"><TrashIcon className="h-4 w-4"/></button>
                        </div>
                        {tag.children && renderTagEditor(tag.children, level + 1)}
                    </li>
                ))}
            </ul>
        );
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

                <div className="flex-1 overflow-y-auto p-6">
                    {renderTagEditor(editableTags)}
                     <button onClick={() => handleAddTag(null)} className="mt-4 flex items-center gap-2 text-sm text-accent hover:underline">
                        <PlusIcon className="h-5 w-5"/> Add Root Tag
                    </button>
                </div>

                <div className="p-6 border-t border-secondary flex justify-end items-center space-x-4">
                    <button type="button" onClick={onClose} className="bg-secondary hover:bg-secondary/70 text-text-primary font-bold py-2 px-6 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSave} className="bg-accent hover:bg-sky-400 text-primary font-bold py-2 px-6 rounded-lg transition-colors">
                        Save Tags
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TagEditModal;
