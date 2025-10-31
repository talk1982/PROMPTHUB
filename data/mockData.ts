
import { Prompt, Tag } from '../types';

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

export const mockPrompts: Prompt[] = [
    {
        id: 'p1',
        title: 'Cyberpunk Cityscape',
        promptText: 'photo of a futuristic cyberpunk city at night, neon lights reflecting on wet streets, flying vehicles, high detail, cinematic lighting, 8k, photorealistic --ar 16:9',
        aiModel: 'Midjourney v6',
        tags: ['1', '1-1'],
        isPublic: true,
        author: 'User123',
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
        author: 'ArtFan',
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
        author: 'DevTrader',
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
        author: 'MarketingMaven',
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
        author: 'Dreamer',
        createdAt: '2023-10-22T11:45:00Z',
        sampleResult: {
            type: 'image',
            content: 'https://picsum.photos/seed/fantasy/800/450'
        }
    }
];
