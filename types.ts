
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
  author: string;
  createdAt: string;
  sampleResult?: {
    type: 'image' | 'text';
    content: string;
  };
}
