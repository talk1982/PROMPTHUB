import React, { useState } from 'react';
import { Prompt, Tag, User } from '../types';
import { refinePrompt } from '../services/geminiService';
import { BotIcon, CalendarIcon, CloseIcon, CopyIcon, SparklesIcon, EditIcon, TrashIcon, UserIcon, LockIcon } from './icons';
import TagChip from './TagChip';

interface PromptDetailModalProps {
    prompt: Prompt;
    onClose: () => void;
    onEdit: (prompt: Prompt) => void;
    onDelete: (prompt: Prompt) => void;
    allTagsMap: Map<string, Tag>;
    usersMap: Map<string, User>;
    currentUser: User | null;
}

const PromptDetailModal: React.FC<PromptDetailModalProps> = ({ prompt, onClose, onEdit, onDelete, allTagsMap, usersMap, currentUser }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [refinedPrompt, setRefinedPrompt] = useState('');
    
    const isAuthor = currentUser?.id === prompt.author;
    const author = usersMap.get(prompt.author);
    const promptTags = prompt.tags.map(tagId => allTagsMap.get(tagId)?.name).filter(Boolean) as string[];

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleRefine = async () => {
        setIsRefining(true);
        setRefinedPrompt('');
        try {
            const result = await refinePrompt(prompt.promptText);
            setRefinedPrompt(result);
        } catch (error) {
            console.error("Failed to refine prompt:", error);
            setRefinedPrompt("Sorry, there was an error refining the prompt.");
        } finally {
            setIsRefining(false);
        }
    };

    const handleEditClick = () => {
        onClose();
        onEdit(prompt);
    };

    const handleDeleteClick = () => {
        onClose();
        onDelete(prompt);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-primary rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-secondary flex justify-between items-start flex-shrink-0">
                    <div>
                         <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-text-primary">{prompt.title}</h2>
                            {!prompt.isPublic && <div className="flex items-center gap-1.5 text-xs bg-secondary px-2 py-1 rounded-full text-text-secondary"><LockIcon className="h-3 w-3" /> Private</div>}
                         </div>
                        <div className="flex items-center gap-x-6 gap-y-2 text-sm text-text-secondary flex-wrap">
                            <div className="flex items-center gap-2">
                                <BotIcon className="h-4 w-4" />
                                <span>{prompt.aiModel}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                <span>{author?.username || 'Unknown User'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{new Date(prompt.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors flex-shrink-0">
                        <CloseIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-text-primary">Prompt</h3>
                            <div className="bg-secondary p-4 rounded-lg relative">
                                <p className="text-text-primary whitespace-pre-wrap">{prompt.promptText}</p>
                                <button
                                    onClick={() => handleCopy(prompt.promptText)}
                                    className="absolute top-2 right-2 p-2 bg-primary/50 rounded-lg hover:bg-primary"
                                >
                                    <CopyIcon className={`h-5 w-5 ${isCopied ? 'text-green-400' : 'text-text-secondary'}`} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleRefine}
                            disabled={isRefining}
                            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-sky-400 text-primary font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-accent/50 disabled:cursor-not-allowed mb-6"
                        >
                            {isRefining ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                    <span>Refining...</span>
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="h-5 w-5" />
                                    Refine with AI
                                </>
                            )}
                        </button>
                        
                        {refinedPrompt && (
                             <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2 text-text-primary">AI-Refined Prompt</h3>
                                <div className="bg-secondary p-4 rounded-lg relative border border-accent/50">
                                    <p className="text-text-primary whitespace-pre-wrap">{refinedPrompt}</p>
                                    <button
                                        onClick={() => handleCopy(refinedPrompt)}
                                        className="absolute top-2 right-2 p-2 bg-primary/50 rounded-lg hover:bg-primary"
                                    >
                                        <CopyIcon className="h-5 w-5 text-text-secondary" />
                                    </button>
                                </div>
                            </div>
                        )}
                        
                         <div className="flex flex-wrap gap-2">
                            {promptTags.map(tagName => (
                                <TagChip key={tagName} text={tagName} />
                            ))}
                        </div>
                    </div>
                    {/* Right Column */}
                    <div>
                         <h3 className="text-lg font-semibold mb-2 text-text-primary">Sample Result</h3>
                         <div className="bg-secondary rounded-lg overflow-hidden">
                             {prompt.sampleResult?.type === 'image' && prompt.sampleResult.content ? (
                                <img src={prompt.sampleResult.content} alt="Sample result" className="w-full h-auto object-contain"/>
                             ) : (
                                <div className="p-4">
                                     <p className="text-text-secondary text-sm whitespace-pre-wrap">
                                        {prompt.sampleResult?.content || 'No sample result provided.'}
                                     </p>
                                </div>
                             )}
                         </div>
                    </div>
                </div>

                 <div className="p-6 border-t border-secondary flex justify-end items-center space-x-4 flex-shrink-0">
                    {isAuthor && (
                        <>
                            <button type="button" onClick={handleDeleteClick} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                                <TrashIcon className="h-5 w-5"/> Delete
                            </button>
                            <button type="button" onClick={handleEditClick} className="bg-secondary hover:bg-secondary/70 text-text-primary font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                                <EditIcon className="h-5 w-5"/> Edit
                            </button>
                        </>
                    )}
                     <button
                        type="button"
                        onClick={() => handleCopy(prompt.promptText)}
                        className="bg-accent hover:bg-sky-400 text-primary font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <CopyIcon className="h-5 w-5"/>
                        <span>{isCopied ? 'Copied!' : 'Copy Prompt'}</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PromptDetailModal;
