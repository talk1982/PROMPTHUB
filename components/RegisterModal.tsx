import React, { useState } from 'react';
import { User } from '../types';
import { PromptHubLogoIcon } from './icons';

interface RegisterModalProps {
    onRegister: (newUser: Omit<User, 'id' | 'avatar' | 'password'> & {password: string}) => void;
    onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onRegister, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !name || !surname || !username) {
            setError('Please fill in all required fields.');
            return;
        }
        setError('');
        onRegister({ email, password, name, surname, username });
    };
    
    const inputStyles = "w-full px-3 py-2 border border-secondary/50 bg-primary placeholder-text-secondary text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent sm:text-sm";

    return (
         <div className="w-full max-w-md p-8 space-y-6 bg-secondary rounded-lg shadow-xl">
            <div className="text-center">
                <PromptHubLogoIcon className="h-12 w-auto mx-auto text-text-primary mb-4" />
                <h2 className="text-3xl font-extrabold text-text-primary">
                    Create a new account
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                    Or{' '}
                    <button onClick={onSwitchToLogin} className="font-medium text-accent hover:text-sky-400">
                        sign in to your existing account
                    </button>
                </p>
            </div>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="name-reg" className="block text-sm font-medium text-text-primary mb-1">First Name</label>
                        <input id="name-reg" value={name} onChange={e => setName(e.target.value)} placeholder="Alex" required className={inputStyles}/>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="surname-reg" className="block text-sm font-medium text-text-primary mb-1">Last Name</label>
                        <input id="surname-reg" value={surname} onChange={e => setSurname(e.target.value)} placeholder="Johnson" required className={inputStyles}/>
                    </div>
                </div>
                <div>
                    <label htmlFor="username-reg" className="block text-sm font-medium text-text-primary mb-1">Username</label>
                    <input id="username-reg" value={username} onChange={e => setUsername(e.target.value)} placeholder="User123" required className={inputStyles}/>
                </div>
                <div>
                    <label htmlFor="email-reg" className="block text-sm font-medium text-text-primary mb-1">Email Address</label>
                    <input id="email-reg" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required className={inputStyles}/>
                </div>
                <div>
                    <label htmlFor="password-reg" className="block text-sm font-medium text-text-primary mb-1">Password</label>
                    <input id="password-reg" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" required className={inputStyles}/>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <div>
                    <button type="submit" className="mt-2 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary bg-accent hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterModal;