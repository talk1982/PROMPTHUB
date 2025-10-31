
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Prompt, Tag, User } from './types';
import { mockPrompts, mockTags, mockUsers } from './data/mockData';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PromptList from './components/PromptList';
import PromptDetailModal from './components/PromptDetailModal';
import AddPromptModal from './components/AddPromptModal';
import EditPromptModal from './components/EditPromptModal';
import TagEditModal from './components/TagEditModal';
import ConfirmationModal from './components/ConfirmationModal';
import Auth from './components/Auth';
import RegisterModal from './components/RegisterModal';

// Helper to create a map from an array of objects with an 'id' property
const createMap = <T extends { id: string }>(arr: T[]): Map<string, T> => {
    return new Map(arr.map(item => [item.id, item]));
};

function App() {
    // Authentication State
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    // Data State
    const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
    const [tags, setTags] = useState<Tag[]>(mockTags);
    const [allTagsMap, setAllTagsMap] = useState<Map<string, Tag>>(new Map());

    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Filtering and Searching State
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'private'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTagEditModalOpen, setIsTagEditModalOpen] = useState(false);
    const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);
    const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
    
    useEffect(() => {
        // Build a map of all tags and their children for easy lookup
        const map = new Map<string, Tag>();
        const traverse = (tag: Tag) => {
            map.set(tag.id, tag);
            tag.children?.forEach(traverse);
        };
        tags.forEach(traverse);
        setAllTagsMap(map);
    }, [tags]);
    
    const usersMap = useMemo(() => createMap(users), [users]);
    
    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    // FIX: Updated the newUser parameter type to match what RegisterModal provides.
    const handleRegister = (newUser: Omit<User, 'id' | 'avatar' | 'password'> & { password: string }) => {
        const userWithId = { ...newUser, id: `u${users.length + 1}` };
        setUsers(prev => [...prev, userWithId]);
        setCurrentUser(userWithId);
        setAuthMode('login');
    };

    const handleAddPrompt = (newPrompt: Omit<Prompt, 'id' | 'author' | 'createdAt'>) => {
        if (!currentUser) return;
        const promptToAdd: Prompt = {
            ...newPrompt,
            id: `p${Date.now()}`,
            author: currentUser.id,
            createdAt: new Date().toISOString(),
        };
        setPrompts(prev => [promptToAdd, ...prev]);
        setIsAddModalOpen(false);
    };

    const handleEditPrompt = (updatedPrompt: Prompt) => {
        setPrompts(prev => prev.map(p => p.id === updatedPrompt.id ? updatedPrompt : p));
        setIsEditModalOpen(false);
        setPromptToEdit(null);
    };

    const handleDeletePrompt = () => {
        if (!promptToDelete) return;
        setPrompts(prev => prev.filter(p => p.id !== promptToDelete.id));
        setPromptToDelete(null);
    };
    
    const filteredPrompts = useMemo(() => {
        return prompts.filter(prompt => {
            const matchesVisibility = visibilityFilter === 'all' ? (prompt.isPublic || prompt.author === currentUser?.id) : prompt.author === currentUser?.id;
            const matchesTags = selectedTagIds.length === 0 || selectedTagIds.some(tagId => prompt.tags.includes(tagId));
            const author = usersMap.get(prompt.author);
            const matchesSearch = searchQuery.length === 0 ||
                prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prompt.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                author?.username.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesVisibility && matchesTags && matchesSearch;
        });
    }, [prompts, visibilityFilter, selectedTagIds, searchQuery, currentUser, usersMap]);

    const openEditModal = useCallback((prompt: Prompt) => {
        setPromptToEdit(prompt);
        setIsEditModalOpen(true);
        setSelectedPrompt(null);
    }, []);

    const openDeleteConfirmation = useCallback((prompt: Prompt) => {
        setPromptToDelete(prompt);
        setSelectedPrompt(null);
    }, []);

    if (!currentUser) {
        return (
            <div className="bg-primary min-h-screen flex items-center justify-center">
                {authMode === 'login' ? (
                    <Auth onLogin={handleLogin} onSwitchToRegister={() => setAuthMode('register')} users={users} />
                ) : (
                    <RegisterModal onRegister={handleRegister} onSwitchToLogin={() => setAuthMode('login')} />
                )}
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-primary text-text-primary font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                tags={tags}
                selectedTagIds={selectedTagIds}
                onTagSelectionChange={setSelectedTagIds}
                onEditTags={() => setIsTagEditModalOpen(true)}
                visibilityFilter={visibilityFilter}
                onVisibilityChange={setVisibilityFilter}
                currentUser={currentUser}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    currentUser={currentUser} 
                    onLogout={handleLogout} 
                    onAddPrompt={() => setIsAddModalOpen(true)} 
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main className="flex-1 flex overflow-hidden">
                    <PromptList
                        prompts={filteredPrompts}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onPromptSelect={setSelectedPrompt}
                        onPromptEdit={openEditModal}
                        onPromptDelete={openDeleteConfirmation}
                        allTagsMap={allTagsMap}
                        usersMap={usersMap}
                        currentUser={currentUser}
                    />
                </main>
            </div>
            {selectedPrompt && (
                <PromptDetailModal 
                    prompt={selectedPrompt} 
                    onClose={() => setSelectedPrompt(null)} 
                    onEdit={openEditModal}
                    onDelete={openDeleteConfirmation}
                    allTagsMap={allTagsMap}
                    usersMap={usersMap}
                    currentUser={currentUser}
                />
            )}
            {isAddModalOpen && (
                <AddPromptModal 
                    onClose={() => setIsAddModalOpen(false)}
                    onAddPrompt={handleAddPrompt}
                    tags={tags}
                />
            )}
            {isEditModalOpen && promptToEdit && (
                <EditPromptModal
                    prompt={promptToEdit}
                    onClose={() => { setIsEditModalOpen(false); setPromptToEdit(null); }}
                    onEditPrompt={handleEditPrompt}
                    tags={tags}
                />
            )}
            {promptToDelete && (
                <ConfirmationModal 
                    title="Delete Prompt"
                    message={`Are you sure you want to delete "${promptToDelete.title}"? This action cannot be undone.`}
                    onConfirm={handleDeletePrompt}
                    onCancel={() => setPromptToDelete(null)}
                />
            )}
            {isTagEditModalOpen && (
                <TagEditModal 
                    tags={tags}
                    onClose={() => setIsTagEditModalOpen(false)}
                    onSave={(updatedTags) => {
                        setTags(updatedTags);
                        setIsTagEditModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}

export default App;
