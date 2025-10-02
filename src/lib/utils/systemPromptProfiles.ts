import type { SystemPromptProfile } from '../types/SystemPromptProfile';

const STORAGE_KEY = 'systemPromptProfiles';

function getProfiles(): SystemPromptProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SystemPromptProfile[];
  } catch {
    return [];
  }
}

function saveProfile(profile: SystemPromptProfile): void {
  const profiles = getProfiles();
  profiles.push(profile);
  setProfiles(profiles);
}

function updateProfile(updated: SystemPromptProfile): void {
  const profiles = getProfiles().map((p) =>
    p.id === updated.id ? { ...p, ...updated, updatedAt: Date.now() } : p
  );
  setProfiles(profiles);
}

function deleteProfile(id: string): void {
  const profiles = getProfiles().filter((p) => p.id !== id);
  setProfiles(profiles);
}

function setProfiles(profiles: SystemPromptProfile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

/**
 * If you see a TS error about 'find' not existing on type 'SystemPromptProfile[]',
 * add "lib": ["ES2015", ...] to your tsconfig.json compilerOptions.
 */
function getProfileById(id: string): SystemPromptProfile | undefined {
  const profiles = getProfiles();
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].id === id) return profiles[i];
  }
  return undefined;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export {
  STORAGE_KEY,
  getProfiles,
  saveProfile,
  updateProfile,
  deleteProfile,
  setProfiles,
  getProfileById,
  generateId,
};