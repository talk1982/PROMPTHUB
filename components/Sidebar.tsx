import React, { useState } from 'react';
import { Tag } from '../types';
import { TagIcon, ChevronDownIcon, ChevronRightIcon, EditIcon, GlobeIcon, UserIcon } from './icons';

interface TagNodeProps {
    tag: Tag;
    selectedTagIds: Set<string>;
    onTagClick: (tagId: string) => void;
    level: number;
}

const TagNode: React.FC<TagNodeProps> = ({ tag, selectedTagIds, onTagClick, level }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isSelected = selectedTagIds.has(tag.id);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const hasChildren = tag.children && tag.children.length > 0;

    return (
        <li>
            <div
                className={`flex items-center p-2 rounded-md transition-colors duration-150 group`}
                style={{ paddingLeft: `${level * 1.5}rem` }}
            >
                {hasChildren && (
                    <button onClick={handleToggle} className="mr-1 p-1 rounded-full hover:bg-primary/50">
                        {isOpen ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                    </button>
                )}
                 {!hasChildren && <div className="w-6 mr-1"></div>}
                <div 
                    onClick={() => onTagClick(tag.id)}
                    className={`flex items-center flex-grow cursor-pointer p-1 rounded ${
                    isSelected ? 'bg-accent/20 text-accent' : 'hover:bg-secondary'
                }`}>
                    <TagIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium select-none">{tag.name}</span>
                </div>
            </div>
            {hasChildren && isOpen && (
                <ul className="space-y-1 mt-1">
                    {tag.children?.map(child => (
                        <TagNode
                            key={child.id}
                            tag={child}
                            selectedTagIds={selectedTagIds}
                            onTagClick={onTagClick}
                            level={level + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};


interface SidebarProps {
    tags: Tag[];
    selectedTagIds: string[];
    onTagSelectionChange: (selectedIds: string[]) => void;
    onEditTags: () => void;
    visibilityFilter: 'all' | 'private';
    onVisibilityChange: (filter: 'all' | 'private') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tags, selectedTagIds, onTagSelectionChange, onEditTags, visibilityFilter, onVisibilityChange }) => {
    const selectedSet = new Set(selectedTagIds);

    const handleTagClick = (tagId: string) => {
        const newSelected = new Set(selectedSet);
        if (newSelected.has(tagId)) {
            newSelected.delete(tagId);
        } else {
            newSelected.add(tagId);
        }
        onTagSelectionChange(Array.from(newSelected));
    };
    
    return (
        <aside className="bg-primary border-r border-secondary w-72 p-4 flex flex-col flex-shrink-0 h-full">
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2 px-2">View</h2>
                <ul className="space-y-1">
                    <li>
                        <button 
                            onClick={() => onVisibilityChange('all')}
                            className={`w-full flex items-center p-2 rounded-md text-sm font-medium transition-colors ${
                                visibilityFilter === 'all' ? 'bg-accent/20 text-accent' : 'hover:bg-secondary'
                            }`}>
                            <GlobeIcon className="h-4 w-4 mr-2" />
                            All Prompts
                        </button>
                    </li>
                     <li>
                        <button 
                            onClick={() => onVisibilityChange('private')}
                            className={`w-full flex items-center p-2 rounded-md text-sm font-medium transition-colors ${
                                visibilityFilter === 'private' ? 'bg-accent/20 text-accent' : 'hover:bg-secondary'
                            }`}>
                            <UserIcon className="h-4 w-4 mr-2" />
                            My Prompts
                        </button>
                    </li>
                </ul>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 border-t border-secondary pt-4">
                <h2 className="text-lg font-semibold mb-4 px-2">Categories</h2>
                <ul className="space-y-1">
                    {tags.map(tag => (
                        <TagNode key={tag.id} tag={tag} selectedTagIds={selectedSet} onTagClick={handleTagClick} level={0} />
                    ))}
                </ul>
            </div>
            <div className="mt-4 pt-4 border-t border-secondary">
                <button 
                    onClick={onEditTags}
                    className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/70 text-text-primary font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    <EditIcon className="h-5 w-5"/>
                    Manage Tags
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;