import { Prompt, Tag, User } from '../types';

// More detailed mock users for a richer experience
export const mockUsers: User[] = [
    { 
        id: 'u1', 
        username: 'User123',
        name: 'Alex',
        surname: 'Johnson',
        email: 'alex@example.com',
        password: 'alex@example.com',
        avatar: 'https://i.pravatar.cc/150?u=u1'
    },
    { 
        id: 'u2', 
        username: 'ArtFan',
        name: 'Bella',
        surname: 'Chen',
        email: 'bella@example.com',
        password: 'bella@example.com',
        avatar: 'https://i.pravatar.cc/150?u=u2'
    },
    { 
        id: 'u3', 
        username: 'DevTrader',
        name: 'Charlie',
        surname: 'Davis',
        email: 'charlie@example.com',
        password: 'charlie@example.com',
    },
    { 
        id: 'u4', 
        username: 'MarketingMaven',
        name: 'Diana',
        surname: 'Prince',
        email: 'diana@example.com',
        password: 'diana@example.com',
        avatar: 'https://i.pravatar.cc/150?u=u4'
    },
    { 
        id: 'u5', 
        username: 'Dreamer',
        name: 'Ethan',
        surname: 'Hunt',
        email: 'ethan@example.com',
        password: 'ethan@example.com',
    }
];

export const mockTags: Tag[] = [
    { 
        id: '1', 
        name: 'Image Generation',
        children: [
            { id: '1-1', name: 'Photorealism' },
            { id: '1-2', name: 'Anime' },
            { id: '1-3', name: 'Fantasy Art' },
        ]
    },
    { 
        id: '2', 
        name: 'Text Generation',
        children: [
            { id: '2-1', name: 'Copywriting' },
            { id: '2-2', name: 'Creative Writing' },
        ]
    },
    { 
        id: '3', 
        name: 'Code Generation' 
    },
    { 
        id: '4', 
        name: 'Stock Market',
        children: [
            { id: '4-1', name: 'Trading Bots' },
            { id: '4-2', name: 'Market Analysis' },
        ]
    },
];

// Prompts updated to use user IDs for the author field
export const mockPrompts: Prompt[] = [
    {
        id: 'p1',
        title: 'Cyberpunk Cityscape',
        promptText: 'photo of a futuristic cyberpunk city at night, neon lights reflecting on wet streets, flying vehicles, high detail, cinematic lighting, 8k, photorealistic --ar 16:9',
        aiModel: 'Midjourney v6',
        tags: ['1', '1-1'],
        isPublic: true,
        author: 'u1', // User ID
        createdAt: '2023-10-26T10:00:00Z',
        sampleResult: {
            type: 'image',
            content: 'https://picsum.photos/seed/cyberpunk/800/450'
        }
    },
    {
        id: 'p2',
        title: 'Anime Hero Character',
        promptText: 'A dynamic anime-style hero with spiky silver hair, glowing blue eyes, wielding a crystal sword. Full body shot, epic battle pose, detailed armor, digital anime art.',
        aiModel: 'DALL-E 3',
        tags: ['1', '1-2'],
        isPublic: true,
        author: 'u2', // User ID
        createdAt: '2023-10-25T14:30:00Z',
        sampleResult: {
            type: 'image',
            content: 'https://picsum.photos/seed/animehero/800/450'
        }
    },
    {
        id: 'p3',
        title: 'Python Trading Bot Strategy',
        promptText: 'Generate a Python script for a simple moving average crossover trading bot using the `pandas` and `yfinance` libraries. The bot should buy when the 50-day MA crosses above the 200-day MA and sell when it crosses below. Include comments explaining each step.',
        aiModel: 'Gemini Pro',
        tags: ['3', '4', '4-1'],
        isPublic: false,
        author: 'u3', // User ID
        createdAt: '2023-10-24T18:00:00Z',
        sampleResult: {
            type: 'text',
            content: '```python\nimport yfinance as yf\nimport pandas as pd\n# ... (script continues)\n```'
        }
    },
    {
        id: 'p4',
        title: 'Luxury Watch Ad Copy',
        promptText: 'Write a short, persuasive ad copy for a new luxury watch. Emphasize craftsmanship, timeless design, and the feeling of success. Target audience: successful professionals aged 35-55. Tone: sophisticated, elegant, exclusive.',
        aiModel: 'Claude 3 Opus',
        tags: ['2', '2-1'],
        isPublic: true,
        author: 'u4', // User ID
        createdAt: '2023-10-23T09:15:00Z',
        sampleResult: {
            type: 'text',
            content: 'The Apex Chronograph: More than a measure of time, a measure of achievement. Forged from a legacy of precision, designed for a future you command.'
        }
    },
    {
        id: 'p5',
        title: 'Enchanted Forest Concept Art',
        promptText: 'Breathtaking fantasy concept art of an enchanted forest. Giant, glowing mushrooms illuminate a path, mystical creatures peek from behind ancient trees, a sense of magic and wonder, digital painting, by Greg Rutkowski.',
        aiModel: 'Stable Diffusion XL',
        tags: ['1', '1-3'],
        isPublic: true,
        author: 'u5', // User ID
        createdAt: '2023-10-22T11:45:00Z',
        sampleResult: {
            type: 'image',
            content: 'https://picsum.photos/seed/fantasy/800/450'
        }
    }
];