import { FileData } from "@google/genai";

export interface User {
  id: string;
  username: string; // Keep for display, but login will use email
  name: string;
  surname: string;
  email: string;
  password?: string; // Stored for mock auth, would be hashed in a real app
  avatar?: string; // URL to an image
}

export interface Tag {
  id: string;
  name: string;
  children?: Tag[];
}

export interface Prompt {
  id: string;
  title: string;
  promptText: string;
  aiModel: string;
  tags: string[];
  isPublic: boolean;
  author: string; // This will now be the user's ID
  createdAt: string;
  sampleResult?: {
    type: 'image' | 'text';
    content: string;
  };
}
