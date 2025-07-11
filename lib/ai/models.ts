// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "gemini-2.5-flash",
    label: "Chat Model",
    apiIdentifier: "gemini-2.5-flash",
    description: "For Advanced Reasoning Tasks",
  },
  {
    id: "gemini-2.0-flash-preview-image-generation",
    label: "Image Generation Model",
    apiIdentifier: "gemini-2.0-flash-preview-image-generation",
    description: "Generates Images from text prompts.",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "gemini-2.5-flash";
