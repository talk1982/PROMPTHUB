import React, { useState, useMemo, useCallback } from 'react';
import { Prompt, Tag } from './types';
import { mockPrompts, mockTags } from './data/mockData';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PromptList from './components/PromptList';
import PromptDetailModal from './components/PromptDetailModal';
import EditPromptModal from './components/EditPromptModal';
import AddPromptModal from './components/AddPromptModal';
import TagEditModal from './components/TagEditModal';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
    const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
    const [tags, setTags] = useState<Tag[]>(mockTags);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'private'>('all');

    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTagEditModalOpen, setIsTagEditModalOpen] = useState(false);
    const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);

    const filteredPrompts = useMemo(() => {
        return prompts.filter(prompt => {
            const visibilityMatch = visibilityFilter === 'all' || (visibilityFilter === 'private' && !prompt.isPublic);
            if (!visibilityMatch) return false;

            const searchMatch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prompt.promptText.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (selectedTagIds.length === 0) {
                return searchMatch;
            }

            const tagMatch = selectedTagIds.every(tagId => prompt.tags.includes(tagId));

            return searchMatch && tagMatch;
        });
    }, [prompts, searchQuery, selectedTagIds, visibilityFilter]);

    const handleTagSelectionChange = useCallback((ids: string[]) => {
        setSelectedTagIds(ids);
    }, []);

    const handleAddPrompt = () => {
        setIsAddModalOpen(true);
    };

    const handleSaveNewPrompt = (newPrompt: Prompt) => {
        setPrompts(prev => [newPrompt, ...prev]);
        setIsAddModalOpen(false);
    };

    const handleEditPrompt = (prompt: Prompt) => {
        setEditingPrompt(prompt);
    };

    const handleSaveEditedPrompt = (updatedPrompt: Prompt) => {
        setPrompts(prev => prev.map(p => p.id === updatedPrompt.id ? updatedPrompt : p));
        setEditingPrompt(null);
        if (selectedPrompt?.id === updatedPrompt.id) {
            setSelectedPrompt(updatedPrompt);
        }
    };
    
    const handleDeletePromptRequest = (prompt: Prompt) => {
        setPromptToDelete(prompt);
    };

    const confirmDeletePrompt = () => {
        if (promptToDelete) {
            setPrompts(prev => prev.filter(p => p.id !== promptToDelete.id));
            setPromptToDelete(null);
            setSelectedPrompt(null); // Close detail view if it was open
        }
    };
    
    const allTagsMap = useMemo(() => {
        const map = new Map<string, Tag>();
        function traverse(tags: Tag[]) {
            tags.forEach(tag => {
                map.set(tag.id, tag);
                if (tag.children) {
                    traverse(tag.children);
                }
            });
        }
        traverse(tags);
        return map;
    }, [tags]);

    return (
        <div className="bg-background text-text-primary h-screen w-screen flex flex-col font-sans overflow-hidden">
            <Header onAddPrompt={handleAddPrompt} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    tags={tags}
                    selectedTagIds={selectedTagIds}
                    onTagSelectionChange={handleTagSelectionChange}
                    onEditTags={() => setIsTagEditModalOpen(true)}
                    visibilityFilter={visibilityFilter}
                    onVisibilityChange={setVisibilityFilter}
                />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <PromptList
                        prompts={filteredPrompts}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onPromptSelect={setSelectedPrompt}
                        onPromptEdit={handleEditPrompt}
                        onPromptDelete={handleDeletePromptRequest}
                        allTagsMap={allTagsMap}
                    />
                </main>
            </div>

            {selectedPrompt && (
                <PromptDetailModal
                    prompt={selectedPrompt}
                    onClose={() => setSelectedPrompt(null)}
                    onEdit={handleEditPrompt}
                    onDelete={handleDeletePromptRequest}
                    allTagsMap={allTagsMap}
                />
            )}

            {editingPrompt && (
                <EditPromptModal
                    prompt={editingPrompt}
                    allTags={tags}
                    onClose={() => setEditingPrompt(null)}
                    onSave={handleSaveEditedPrompt}
                />
            )}

            <AddPromptModal 
                isOpen={isAddModalOpen}
                allTags={tags}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveNewPrompt}
            />

            <TagEditModal 
                isOpen={isTagEditModalOpen}
                tags={tags}
                onClose={() => setIsTagEditModalOpen(false)}
                onSave={(newTags) => setTags(newTags)}
            />

            <ConfirmationModal
                isOpen={!!promptToDelete}
                title="Delete Prompt"
                message={`Are you sure you want to delete the prompt "${promptToDelete?.title}"? This action cannot be undone.`}
                onConfirm={confirmDeletePrompt}
                onCancel={() => setPromptToDelete(null)}
                confirmText="Delete"
            />
        </div>
    );
};

export default App;