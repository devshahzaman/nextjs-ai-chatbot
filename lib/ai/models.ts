// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'gemini-2.0-flash-exp',
    label: 'Gemini 2.0 Flash Experimental',
    apiIdentifier: 'gemini-2.0-flash-exp',
    description: 'For Advanced Reasoning Tasks',
  },
  {
    id: 'gemini-1.5-flash',
    label: 'Gemini 1.5 Flash',
    apiIdentifier: 'gemini-1.5-flash',
    description: 'Great for Small Tasks.',
  },
    {
    id: 'gemini-1.5-pro',
    label: 'Gemini 1.5 Pro',
    apiIdentifier: 'gemini-1.5-pro',
    description: 'Great for Everyday Tasks.',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'gemini-2.0-flash-exp';
