<script lang="ts">
  import { onMount } from 'svelte';
  import { settings } from '$lib/stores';

  onMount(() => {
    console.log("SidebarProfiles mounted");
  });
  import {
    getProfiles,
    saveProfile,
    generateId
  } from '$lib/utils/systemPromptProfiles';
  import type { SystemPromptProfile } from '$lib/types/SystemPromptProfile';

  let profileList: SystemPromptProfile[] = [];
  let selectedProfileId: string | null = null;
  let showForm = false;
  let formName = '';
  let formSystemPrompt = '';
  let formModels: string[] = [];

  function refreshProfiles() {
    profileList = getProfiles();
  }

  function handleApply(profile: SystemPromptProfile) {
    settings.update((s) => ({
      ...s,
      system: profile.systemPrompt,
      models: profile.models
    }));
    selectedProfileId = profile.id;
  }

  function startCreate() {
    showForm = true;
    formName = '';
    formSystemPrompt = '';
    formModels = [];
  }

  function handleFormSubmit() {
    if (!formName.trim() || !formSystemPrompt.trim()) {
      alert('Name and system prompt are required.');
      return;
    }
    const now = Date.now();
    const newProfile: SystemPromptProfile = {
      id: generateId(),
      name: formName.trim(),
      description: '',
      systemPrompt: formSystemPrompt,
      models: formModels,
      createdAt: now,
      updatedAt: now
    };
    saveProfile(newProfile);
    showForm = false;
    refreshProfiles();
  }

  function handleFormCancel() {
    showForm = false;
  }

  function getAvatar(profile: SystemPromptProfile) {
    // Use a default icon, or initials if you want to be fancy
    return "/static/favicon.png";
  }

  onMount(() => {
    refreshProfiles();
  });
</script>

<div class="sidebar-profiles">
  <div class="sidebar-profiles-header">
    <span class="sidebar-profiles-label">Profiles</span>
    <svg class="sidebar-profiles-arrow" width="16" height="16" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 8l4 4 4-4"/></svg>
  </div>
  <ul class="sidebar-profiles-list">
    {#each profileList as profile}
      <li
        class="sidebar-profile-item {selectedProfileId === profile.id ? 'selected' : ''}"
        title={profile.description}
        on:click={() => handleApply(profile)}
      >
        <img class="sidebar-profile-avatar" src={getAvatar(profile)} alt="avatar" />
        <span class="sidebar-profile-name">{profile.name}</span>
        <!-- Optional: ... menu on hover
        <span class="sidebar-profile-menu">...</span>
        -->
      </li>
    {/each}
  </ul>
  <button class="sidebar-profile-new-btn" on:click={startCreate}>+ New Profile</button>

  {#if showForm}
    <div class="sidebar-profile-form">
      <input
        class="sidebar-profile-input"
        placeholder="Name"
        bind:value={formName}
        maxlength="50"
      />
      <textarea
        class="sidebar-profile-input"
        placeholder="System Prompt"
        rows="2"
        bind:value={formSystemPrompt}
      />
      <div class="sidebar-profile-form-actions">
        <button class="sidebar-profile-save-btn" on:click={handleFormSubmit}>Create</button>
        <button class="sidebar-profile-cancel-btn" on:click={handleFormCancel}>Cancel</button>
      </div>
    </div>
  {/if}
</div>

<style>
.sidebar-profiles {
  margin-bottom: 1rem;
  font-family: inherit;
}
.sidebar-profiles-header {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: #888;
  font-weight: 600;
  margin: 12px 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.sidebar-profiles-label {
  flex: 1;
}
.sidebar-profiles-arrow {
  width: 1em;
  height: 1em;
  color: #bbb;
}
.sidebar-profiles-list {
  list-style: none;
  padding: 0;
  margin: 0 0 8px 0;
}
.sidebar-profile-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.15s;
  margin-bottom: 2px;
}
.sidebar-profile-item.selected,
.sidebar-profile-item:hover {
  background: #f3f4f6;
}
.sidebar-profile-item.selected {
  background: #e5e7eb;
}
.sidebar-profile-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}
.sidebar-profile-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sidebar-profile-menu {
  opacity: 0;
  margin-left: 8px;
  font-size: 1.2em;
  color: #aaa;
  transition: opacity 0.2s;
}
.sidebar-profile-item:hover .sidebar-profile-menu {
  opacity: 1;
}
.sidebar-profile-new-btn {
  width: 100%;
  font-size: 0.95rem;
  padding: 6px 0;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-top: 6px;
  margin-bottom: 8px;
  transition: background 0.15s;
}
.sidebar-profile-new-btn:hover {
  background: #1d4ed8;
}
.sidebar-profile-form {
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px;
  margin-top: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.sidebar-profile-input {
  width: 100%;
  font-size: 0.95rem;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  margin-bottom: 6px;
}
.sidebar-profile-form-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
.sidebar-profile-save-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
}
.sidebar-profile-cancel-btn {
  background: #e5e7eb;
  color: #222;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
}
</style>