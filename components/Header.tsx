import React from 'react';
import { User } from '../types';
import { PromptHubLogoIcon, MenuIcon, LogoutIcon, UserCircleIcon } from './icons';

interface HeaderProps {
    currentUser: User;
    onLogout: () => void;
    onAddPrompt: () => void;
    onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onAddPrompt, onToggleSidebar }) => {
    return (
        <header className="bg-primary border-b border-secondary flex items-center justify-between p-4 flex-shrink-0 relative z-10">
            <div className="flex items-center space-x-3">
                 <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-md text-text-secondary hover:bg-secondary md:hidden"
                    aria-label="Toggle menu"
                >
                    <MenuIcon className="h-6 w-6" />
                </button>
                <div className="hidden md:flex items-center">
                    <PromptHubLogoIcon className="h-8 w-auto text-text-primary" />
                </div>
            </div>

            {/* Centered title for mobile */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
                 <PromptHubLogoIcon className="h-8 w-auto text-text-primary" />
            </div>

            <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                    {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.username} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                        <UserCircleIcon className="h-8 w-8 text-text-secondary" />
                    )}
                    <span className="text-sm font-semibold text-text-primary hidden sm:inline">{currentUser.name} {currentUser.surname}</span>
                </div>
                <button
                    onClick={onAddPrompt}
                    className="bg-accent hover:bg-sky-400 text-primary font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    + Add Prompt
                </button>
                 <button onClick={onLogout} className="p-2 rounded-full hover:bg-secondary text-text-secondary hover:text-red-500 transition-colors" aria-label="Logout">
                    <LogoutIcon className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};

export default Header;