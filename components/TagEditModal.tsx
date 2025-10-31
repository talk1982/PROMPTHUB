// FIX: Removed file boundary markers from the top and bottom of the file.
import React, { useState, useCallback } from 'react';
import { Tag } from '../types';
import { CloseIcon, TrashIcon, GripVerticalIcon } from './icons';

// --- Helper Functions for Tree Manipulation ---

// Finds and removes a tag from a nested structure.
const findAndRemoveTag = (tags: Tag[], tagId: string): { foundTag: Tag | null; newTree: Tag[] } => {
    let foundTag: Tag | null = null;
    const filterRecursive = (tagList: Tag[]): Tag[] => {
        const list = tagList.filter(tag => {
            if (tag.id === tagId) {
                foundTag = { ...tag, children: tag.children ? [...tag.children] : [] };
                return false;
            }
            return true;
        });
        return list.map(tag => {
            if (tag.children) {
                return { ...tag, children: filterRecursive(tag.children) };
            }
            return tag;
        });
    };
    const newTree = filterRecursive(tags);
    return { foundTag, newTree };
};

// Inserts a tag into a new position in the nested structure.
const insertTag = (tags: Tag[], tagToInsert: Tag, targetId: string, position: 'before' | 'after' | 'on'): Tag[] => {
    if (position === 'on') { // Make it a child of the target
        return tags.map(tag => {
            if (tag.id === targetId) {
                const children = tag.children ? [...tag.children, tagToInsert] : [tagToInsert];
                return { ...tag, children };
            }
            if (tag.children) {
                return { ...tag, children: insertTag(tag.children, tagToInsert, targetId, position) };
            }
            return tag;
        });
    }

    // Insert as a sibling (before/after)
    let newTags: Tag[] = [];
    let inserted = false;
    for (const tag of tags) {
        if (tag.id === targetId) {
            if (position === 'before') newTags.push(tagToInsert);
            newTags.push(tag);
            if (position === 'after') newTags.push(tagToInsert);
            inserted = true;
        } else {
            newTags.push(tag);
        }
    }

    if (inserted) return newTags;
    
    // If target not found at this level, recurse into children
    return tags.map(tag => {
        if (tag.children) {
            return { ...tag, children: insertTag(tag.children, tagToInsert, targetId, position) };
        }
        return tag;
    });
};


type DropIndicator = { targetId: string; position: 'before' | 'after' | 'on' };

interface EditableTagNodeProps {
    tag: Tag;
    level: number;
    onNameChange: (tagId: string, newName: string) => void;
    onDelete: (tagId: string) => void;
    onDragStart: (e: React.DragEvent, tagId: string) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent, tagId: string) => void;
    dropIndicator: DropIndicator | null;
}

const EditableTagNode: React.FC<EditableTagNodeProps> = ({ tag, level, onNameChange, onDelete, onDragStart, onDragEnd, onDragOver, dropIndicator }) => {
    const isDropTargetBefore = dropIndicator?.targetId === tag.id && dropIndicator?.position === 'before';
    const isDropTargetAfter = dropIndicator?.targetId === tag.id && dropIndicator?.position === 'after';
    const isDropTargetOn = dropIndicator?.targetId === tag.id && dropIndicator?.position === 'on';

    return (
        <div className="relative">
            {isDropTargetBefore && <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent z-10" />}
            <div
                draggable
                onDragStart={(e) => onDragStart(e, tag.id)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => onDragOver(e, tag.id)}
                className={`flex items-center gap-2 group relative rounded-lg ${isDropTargetOn ? 'bg-accent/20' : ''}`}
                style={{ paddingLeft: `${level * 1.5}rem` }}
            >
                <div className="py-2 cursor-grab text-text-secondary/50 group-hover:text-text-secondary">
                    <GripVerticalIcon className="h-5 w-5" />
                </div>
                <input
                    type="text"
                    value={tag.name}
                    onChange={(e) => onNameChange(tag.id, e.target.value)}
                    className="flex-grow bg-transparent p-2 focus:outline-none focus:bg-secondary rounded"
                />
                <button onClick={() => onDelete(tag.id)} className="p-2 rounded-full hover:bg-secondary text-text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
            {isDropTargetAfter && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent z-10" />}
            
            {tag.children && tag.children.length > 0 && (
                 <div className="pl-4 border-l-2 border-secondary/30 ml-3">
                    {tag.children.map(child => (
                        <EditableTagNode 
                            key={child.id}
                            tag={child}
                            level={level + 1}
                            onNameChange={onNameChange}
                            onDelete={onDelete}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            onDragOver={onDragOver}
                            dropIndicator={dropIndicator}
                        />
                    ))}
                 </div>
            )}
        </div>
    );
};


interface TagEditModalProps {
    tags: Tag[];
    onClose: () => void;
    onSave: (updatedTags: Tag[]) => void;
}

const TagEditModal: React.FC<TagEditModalProps> = ({ tags, onClose, onSave }) => {
    const [editableTags, setEditableTags] = useState<Tag[]>(() => JSON.parse(JSON.stringify(tags)));
    const [newTagName, setNewTagName] = useState('');
    
    // Drag and Drop State
    const [draggedTagId, setDraggedTagId] = useState<string | null>(null);
    const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);

    const handleSave = () => onSave(editableTags);

    const handleAddTag = () => {
        if (!newTagName.trim()) return;
        const newTag: Tag = { id: `tag-${Date.now()}`, name: newTagName.trim() };
        setEditableTags([...editableTags, newTag]);
        setNewTagName('');
    };

    const handleDeleteTag = (tagId: string) => {
        const { newTree } = findAndRemoveTag(editableTags, tagId);
        setEditableTags(newTree);
    };
    
    const handleTagNameChange = (tagId: string, newName: string) => {
        const updateRecursive = (tagList: Tag[]): Tag[] => {
            return tagList.map(tag => {
                if (tag.id === tagId) return { ...tag, name: newName };
                if (tag.children) return { ...tag, children: updateRecursive(tag.children) };
                return tag;
            });
        };
        setEditableTags(updateRecursive(editableTags));
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent, tagId: string) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tagId);
        setDraggedTagId(tagId);
        // Make the ghost image less prominent
        setTimeout(() => { (e.target as HTMLElement).style.opacity = '0.5'; }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        (e.target as HTMLElement).style.opacity = '1';
        setDraggedTagId(null);
        setDropIndicator(null);
    };

    const handleDragOver = useCallback((e: React.DragEvent, targetTagId: string) => {
        e.preventDefault();
        if (targetTagId === draggedTagId) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;
        
        let position: 'before' | 'after' | 'on' = 'on';
        if (y < height * 0.25) position = 'before';
        else if (y > height * 0.75) position = 'after';

        setDropIndicator({ targetId: targetTagId, position });
    }, [draggedTagId]);
    
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!draggedTagId || !dropIndicator) return;

        // Prevent dropping a tag onto itself or its own children
        const isDescendant = (tag: Tag, idToFind: string): boolean => {
            if (tag.id === idToFind) return true;
            return tag.children?.some(child => isDescendant(child, idToFind)) ?? false;
        };
        const { foundTag: draggedTagNode } = findAndRemoveTag(editableTags, draggedTagId);
        if (draggedTagNode && isDescendant(draggedTagNode, dropIndicator.targetId)) {
            return;
        }

        const { foundTag, newTree } = findAndRemoveTag(editableTags, draggedTagId);
        if (!foundTag) return;

        const finalTree = insertTag(newTree, foundTag, dropIndicator.targetId, dropIndicator.position);
        setEditableTags(finalTree);
    }, [draggedTagId, dropIndicator, editableTags]);


    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-primary rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-secondary flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-text-primary">Manage Tags</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                        <CloseIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-2" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
                     {editableTags.map(tag => (
                        <EditableTagNode 
                            key={tag.id}
                            tag={tag}
                            level={0}
                            onNameChange={handleTagNameChange}
                            onDelete={handleDeleteTag}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            dropIndicator={dropIndicator}
                        />
                     ))}
                </div>
                <div className="p-6 border-t border-secondary flex-shrink-0">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            placeholder="New tag name"
                            className="flex-grow bg-secondary border border-secondary/50 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <button onClick={handleAddTag} className="bg-accent hover:bg-sky-400 text-primary font-bold py-2 px-4 rounded-lg transition-colors">
                            Add
                        </button>
                    </div>
                </div>
                <div className="p-6 border-t border-secondary flex justify-end items-center space-x-4 flex-shrink-0">
                    <button type="button" onClick={onClose} className="bg-secondary hover:bg-secondary/70 text-text-primary font-bold py-2 px-6 rounded-lg transition-colors">Cancel</button>
                    <button type="button" onClick={handleSave} className="bg-accent hover:bg-sky-400 text-primary font-bold py-2 px-6 rounded-lg transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};

export default TagEditModal;
