import React from 'react';
import { Prompt, Tag } from '../types';
import PromptCard from './PromptCard';
import { SearchIcon } from './icons';

interface PromptListProps {
    prompts: Prompt[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onPromptSelect: (prompt: Prompt) => void;
    onPromptEdit: (prompt: Prompt) => void;
    onPromptDelete: (prompt: Prompt) => void;
    allTagsMap: Map<string, Tag>;
}

const PromptList: React.FC<PromptListProps> = ({
    prompts,
    searchQuery,
    onSearchChange,
    onPromptSelect,
    onPromptEdit,
    onPromptDelete,
    allTagsMap
}) => {
    return (
        <div className="flex-1 flex flex-col bg-background p-6 overflow-hidden">
            <div className="relative mb-6 flex-shrink-0">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                    type="text"
                    placeholder="Search prompts by title or content..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-secondary border border-secondary/50 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent transition"
                />
            </div>
            {prompts.length > 0 ? (
                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {prompts.map(prompt => (
                            <PromptCard
                                key={prompt.id}
                                prompt={prompt}
                                onSelect={() => onPromptSelect(prompt)}
                                onEdit={(e) => { e.stopPropagation(); onPromptEdit(prompt); }}
                                onDelete={(e) => { e.stopPropagation(); onPromptDelete(prompt); }}
                                allTagsMap={allTagsMap}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-text-secondary">
                    <p>No prompts found. Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default PromptList;
