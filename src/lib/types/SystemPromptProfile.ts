export interface SystemPromptProfile {
  id: string; // uuid or unique string
  name: string;
  description?: string;
  systemPrompt: string;
  models: string[]; // array of model IDs
  createdAt: number; // timestamp (ms since epoch)
  updatedAt: number; // timestamp (ms since epoch)
}