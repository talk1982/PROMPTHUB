import React from 'react';
import { BotIcon } from './icons';

interface HeaderProps {
    onAddPrompt: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddPrompt }) => {
    return (
        <header className="bg-primary border-b border-secondary flex items-center justify-between p-4 flex-shrink-0">
            <div className="flex items-center space-x-3">
                <BotIcon className="h-8 w-8 text-accent" />
                <h1 className="text-xl font-bold tracking-tight">Prompt Vault</h1>
            </div>
            <button
                onClick={onAddPrompt}
                className="bg-accent hover:bg-sky-400 text-primary font-bold py-2 px-4 rounded-lg transition-colors"
            >
                + Add Prompt
            </button>
        </header>
    );
};

export default Header;