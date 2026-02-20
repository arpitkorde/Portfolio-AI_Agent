export interface Skill {
  category: string;
  items: string[];
}

export interface Project {
  title: string;
  role: string;
  period: string;
  description: string;
  techStack: string[];
  features: string[];
  impact: string[];
  link?: string;
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  university: string;
  year: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  github: string;
  calendar?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

declare global {
  interface Window {
    aistudio: any;
  }
}