import React, { useState } from 'react';
import { Prompt, Tag, User } from '../types';
import { CalendarIcon, CheckIcon, CopyIcon, EditIcon, LockIcon, TrashIcon, UserCircleIcon } from './icons';
import TagChip from './TagChip';

interface PromptCardProps {
    prompt: Prompt;
    onSelect: () => void;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    allTagsMap: Map<string, Tag>;
    usersMap: Map<string, User>;
    currentUser: User | null;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onSelect, onEdit, onDelete, allTagsMap, usersMap, currentUser }) => {
    const [isCopied, setIsCopied] = useState(false);

    const isAuthor = currentUser?.id === prompt.author;
    const author = usersMap.get(prompt.author);

    const promptTags = prompt.tags.map(tagId => allTagsMap.get(tagId)?.name).filter(Boolean) as string[];
    const formattedDate = new Date(prompt.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(prompt.promptText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

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
                    {!prompt.isPublic && <LockIcon className="h-5 w-5 text-text-secondary flex-shrink-0" title="Private" />}
                </div>

                <p className="text-sm text-text-secondary mb-3 flex-grow line-clamp-2">
                    {prompt.promptText}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {promptTags.slice(0, 3).map(tagName => (
                        <TagChip key={tagName} text={tagName} />
                    ))}
                </div>

                <div className="mt-auto pt-2 border-t border-secondary text-xs text-text-secondary">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">{prompt.aiModel}</span>
                        <div className="flex items-center gap-1">
                            <button onClick={handleCopy} className="p-2 rounded-full hover:bg-secondary text-text-secondary hover:text-accent transition-colors" aria-label="Copy prompt">
                                {isCopied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <CopyIcon className="h-4 w-4" />}
                            </button>
                            {isAuthor && (
                                <>
                                    <button onClick={onEdit} className="p-2 rounded-full hover:bg-secondary text-text-secondary hover:text-accent transition-colors" aria-label="Edit prompt">
                                        <EditIcon className="h-4 w-4" />
                                    </button>
                                    <button onClick={onDelete} className="p-2 rounded-full hover:bg-secondary text-text-secondary hover:text-red-500 transition-colors" aria-label="Delete prompt">
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1.5">
                            {author?.avatar ? (
                                <img src={author.avatar} alt={author.username} className="h-4 w-4 rounded-full object-cover" />
                            ) : (
                                <UserCircleIcon className="h-4 w-4" />
                            )}
                            <span>{author?.username || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptCard;
