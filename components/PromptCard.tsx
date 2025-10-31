import React from 'react';
import { Prompt, Tag } from '../types';
import { EditIcon, LockIcon, TrashIcon } from './icons';
import TagChip from './TagChip';

interface PromptCardProps {
    prompt: Prompt;
    onSelect: () => void;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    allTagsMap: Map<string, Tag>;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onSelect, onEdit, onDelete, allTagsMap }) => {
    const promptTags = prompt.tags.map(tagId => allTagsMap.get(tagId)?.name).filter(Boolean) as string[];

    return (
        <div 
            onClick={onSelect}
            className="bg-primary rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col h-full border border-secondary"
        >
            {prompt.sampleResult?.type === 'image' && prompt.sampleResult.content ? (
                <img src={prompt.sampleResult.content} alt={prompt.title} className="w-full h-40 object-cover rounded-t-lg" />
            ) : (
                <div className="w-full h-40 bg-secondary rounded-t-lg flex items-center justify-center p-4">
                     <p className="text-text-secondary text-sm line-clamp-4 italic">
                        {prompt.sampleResult?.content || 'No sample result available.'}
                     </p>
                </div>
            )}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-text-primary pr-2">{prompt.title}</h3>
                    {!prompt.isPublic && <LockIcon className="h-5 w-5 text-text-secondary flex-shrink-0" />}
                </div>

                <p className="text-sm text-text-secondary mb-3 flex-grow line-clamp-2">
                    {prompt.promptText}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {promptTags.slice(0, 3).map(tagName => (
                        <TagChip key={tagName} text={tagName} />
                    ))}
                </div>

                <div className="flex justify-between items-center mt-auto pt-2 border-t border-secondary">
                    <span className="text-xs text-text-secondary">{prompt.aiModel}</span>
                    <div className="flex items-center gap-2">
                        <button onClick={onEdit} className="p-2 rounded-full hover:bg-secondary text-text-secondary hover:text-accent transition-colors">
                            <EditIcon className="h-4 w-4" />
                        </button>
                         <button onClick={onDelete} className="p-2 rounded-full hover:bg-secondary text-text-secondary hover:text-red-500 transition-colors">
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptCard;
