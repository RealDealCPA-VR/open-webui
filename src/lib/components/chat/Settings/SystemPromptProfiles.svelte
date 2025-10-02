<!--
SystemPromptProfiles.svelte
UI for managing system prompt/model profiles in chat settings (General tab).
Features:
- List all profiles (name, description, models)
- Select a profile to apply (updates system prompt and models)
- Create, edit, delete profiles
- Form for profile creation/editing (name, description, system prompt, model selection)
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { models, settings } from '$lib/stores';
  import {
    getProfiles,
    saveProfile,
    updateProfile,
    deleteProfile,
    getProfileById,
    generateId,
    setProfiles
  } from '$lib/utils/systemPromptProfiles';
  import type { SystemPromptProfile } from '$lib/types/SystemPromptProfile';

  let profileList: SystemPromptProfile[] = [];
  let selectedProfileId: string | null = null;
  let editingProfile: SystemPromptProfile | null = null;
  let showForm = false;
  let formMode: 'create' | 'edit' = 'create';

  // Form fields
  let formName = '';
  let formDescription = '';
  let formSystemPrompt = '';
  let formModels: string[] = [];

  function refreshProfiles() {
    profileList = getProfiles();
  }

  function startCreate() {
    formMode = 'create';
    editingProfile = null;
    formName = '';
    formDescription = '';
    formSystemPrompt = settings?.system ?? '';
    formModels = settings?.models ?? [];
    showForm = true;
  }

  function startEdit(profile: SystemPromptProfile) {
    formMode = 'edit';
    editingProfile = profile;
    formName = profile.name;
    formDescription = profile.description ?? '';
    formSystemPrompt = profile.systemPrompt;
    formModels = profile.models;
    showForm = true;
  }

  function handleDelete(id: string) {
    if (confirm('Delete this profile?')) {
      deleteProfile(id);
      refreshProfiles();
    }
  }

  function handleApply(profile: SystemPromptProfile) {
    settings.update((s) => ({
      ...s,
      system: profile.systemPrompt,
      models: profile.models
    }));
    selectedProfileId = profile.id;
  }

  function handleFormSubmit() {
    if (!formName.trim() || !formSystemPrompt.trim() || !formModels.length) {
      alert('Name, system prompt, and at least one model are required.');
      return;
    }
    const now = Date.now();
    if (formMode === 'create') {
      const newProfile: SystemPromptProfile = {
        id: generateId(),
        name: formName.trim(),
        description: formDescription.trim(),
        systemPrompt: formSystemPrompt,
        models: formModels,
        createdAt: now,
        updatedAt: now
      };
      saveProfile(newProfile);
    } else if (formMode === 'edit' && editingProfile) {
      const updated: SystemPromptProfile = {
        ...editingProfile,
        name: formName.trim(),
        description: formDescription.trim(),
        systemPrompt: formSystemPrompt,
        models: formModels,
        updatedAt: now
      };
      updateProfile(updated);
    }
    showForm = false;
    refreshProfiles();
  }

  function handleFormCancel() {
    showForm = false;
  }

  onMount(() => {
    refreshProfiles();
  });
</script>

<div class="system-prompt-profiles">
  <h3 class="text-lg font-semibold mb-2">System Prompt Profiles</h3>
  <button class="btn btn-primary mb-2" on:click={startCreate}>New Profile</button>
  {#if profileList.length === 0}
    <div class="text-gray-500 mb-2">No profiles saved.</div>
  {/if}
  <ul class="mb-4">
    {#each profileList as profile}
      <li class="border rounded p-2 mb-2 flex flex-col md:flex-row md:items-center gap-2 {selectedProfileId === profile.id ? 'bg-blue-50' : ''}">
        <div class="flex-1">
          <div class="font-medium">{profile.name}</div>
          {#if profile.description}
            <div class="text-xs text-gray-500">{profile.description}</div>
          {/if}
          <div class="text-xs text-gray-400">Models: {profile.models.join(', ')}</div>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-secondary" on:click={() => handleApply(profile)}>Apply</button>
          <button class="btn btn-sm btn-outline" on:click={() => startEdit(profile)}>Edit</button>
          <button class="btn btn-sm btn-danger" on:click={() => handleDelete(profile.id)}>Delete</button>
        </div>
      </li>
    {/each}
  </ul>

  {#if showForm}
    <div class="border rounded p-4 mb-4 bg-gray-50">
      <h4 class="font-semibold mb-2">{formMode === 'create' ? 'Create Profile' : 'Edit Profile'}</h4>
      <div class="mb-2">
        <label class="block text-sm font-medium mb-1">Name</label>
        <input class="input w-full" bind:value={formName} maxlength="50" />
      </div>
      <div class="mb-2">
        <label class="block text-sm font-medium mb-1">Description</label>
        <input class="input w-full" bind:value={formDescription} maxlength="100" />
      </div>
      <div class="mb-2">
        <label class="block text-sm font-medium mb-1">System Prompt</label>
        <textarea class="input w-full" rows="3" bind:value={formSystemPrompt} />
      </div>
      <div class="mb-2">
        <label class="block text-sm font-medium mb-1">Models</label>
        <select class="input w-full" multiple bind:value={formModels}>
          {#each $models as model}
            <option value={model.id}>{model.name}</option>
          {/each}
        </select>
      </div>
      <div class="flex gap-2 mt-2">
        <button class="btn btn-primary" on:click={handleFormSubmit}>{formMode === 'create' ? 'Create' : 'Save'}</button>
        <button class="btn btn-secondary" on:click={handleFormCancel}>Cancel</button>
      </div>
    </div>
  {/if}
</div>

<style>
.system-prompt-profiles .btn {
  @apply px-3 py-1 rounded text-sm;
}
.system-prompt-profiles .btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
.system-prompt-profiles .btn-secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
}
.system-prompt-profiles .btn-outline {
  @apply border border-gray-400 text-gray-700 hover:bg-gray-100;
}
.system-prompt-profiles .btn-danger {
  @apply bg-red-500 text-white hover:bg-red-600;
}
.system-prompt-profiles .input {
  @apply border border-gray-300 rounded px-2 py-1;
}
</style>