import React, { useState } from 'react';
import { User } from '../types';
import { PromptHubLogoIcon } from './icons';

interface AuthProps {
    onLogin: (user: User) => void;
    onSwitchToRegister: () => void;
    users: User[];
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSwitchToRegister, users }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            onLogin(user);
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="w-full max-w-sm p-8 space-y-6 bg-secondary rounded-lg shadow-xl">
            <div className="text-center">
                <PromptHubLogoIcon className="h-12 w-auto mx-auto text-text-primary mb-4" />
                <h2 className="text-3xl font-extrabold text-text-primary">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                    Or{' '}
                    <button onClick={onSwitchToRegister} className="font-medium text-accent hover:text-sky-400">
                        create a new account
                    </button>
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email-address-auth" className="block text-sm font-medium text-text-primary mb-1">Email Address</label>
                    <input
                        id="email-address-auth"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full px-3 py-2 border border-secondary/50 bg-primary placeholder-text-secondary text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent sm:text-sm"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password-auth" className="block text-sm font-medium text-text-primary mb-1">Password</label>
                    <input
                        id="password-auth"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="w-full px-3 py-2 border border-secondary/50 bg-primary placeholder-text-secondary text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent sm:text-sm"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary bg-accent hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent"
                    >
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Auth;