<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' });
useSeoMeta({ title: 'Mes liens — Smart Identity' });

const profileStore = useProfileStore();
await profileStore.fetchProfile();

const links = computed(() => profileStore.profile?.profile?.links ?? []);

const showForm = ref(false);
const editingId = ref<string | null>(null);
const form = reactive({ label: '', url: '', icon: 'link' });
const saving = ref(false);
const error = ref('');

const iconOptions = [
  { v: 'link', l: '🔗 Lien' },
  { v: 'linkedin', l: '💼 LinkedIn' },
  { v: 'github', l: '🐙 GitHub' },
  { v: 'twitter', l: '🐦 Twitter' },
  { v: 'instagram', l: '📸 Instagram' },
  { v: 'globe', l: '🌐 Site web' },
  { v: 'mail', l: '✉️ Email' },
  { v: 'phone', l: '📱 Téléphone' },
];

function openAdd() {
  editingId.value = null;
  form.label = '';
  form.url = '';
  form.icon = 'link';
  showForm.value = true;
  error.value = '';
}

function openEdit(link: any) {
  editingId.value = link._id;
  form.label = link.label;
  form.url = link.url;
  form.icon = link.icon || 'link';
  showForm.value = true;
  error.value = '';
}

async function save() {
  saving.value = true;
  error.value = '';
  try {
    if (editingId.value) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      const data = await $fetch<{ links: any[] }>(`${config.public.apiBase}/me/links/${editingId.value}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: form,
      });
      if (profileStore.profile) profileStore.profile.profile.links = data.links;
    } else {
      await profileStore.addLink({ ...form });
    }
    showForm.value = false;
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Erreur lors de la sauvegarde';
  } finally {
    saving.value = false;
  }
}

async function remove(id: string) {
  await profileStore.deleteLink(id);
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-display font-bold">Mes liens</h1>
      <button @click="openAdd" class="btn-primary text-sm py-2">+ Ajouter un lien</button>
    </div>

    <!-- Form modal -->
    <div v-if="showForm" class="card mb-6 border-accent/30">
      <h2 class="font-display font-semibold mb-4">{{ editingId ? 'Modifier le lien' : 'Nouveau lien' }}</h2>
      <form @submit.prevent="save" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Icône</label>
            <select v-model="form.icon" class="input-field">
              <option v-for="opt in iconOptions" :key="opt.v" :value="opt.v">{{ opt.l }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Label</label>
            <input v-model="form.label" type="text" placeholder="Mon portfolio" class="input-field" required />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">URL</label>
          <input v-model="form.url" type="url" placeholder="https://..." class="input-field" required />
        </div>
        <p v-if="error" class="text-sm px-3 py-2 rounded-lg" style="background: rgba(239,68,68,0.1); color: #f87171;">{{ error }}</p>
        <div class="flex gap-3">
          <button type="submit" class="btn-primary flex-1" :disabled="saving">{{ saving ? 'Sauvegarde...' : 'Enregistrer' }}</button>
          <button type="button" @click="showForm = false" class="btn-ghost flex-1">Annuler</button>
        </div>
      </form>
    </div>

    <!-- Links list -->
    <div v-if="links.length === 0 && !showForm" class="text-center py-16">
      <div class="text-5xl mb-4">🔗</div>
      <p class="font-display font-semibold mb-2">Aucun lien pour l'instant</p>
      <p class="text-sm mb-6" style="color: var(--muted);">Ajoutez vos réseaux sociaux, portfolio, email...</p>
      <button @click="openAdd" class="btn-primary">Ajouter mon premier lien</button>
    </div>

    <div class="space-y-3">
      <div
        v-for="link in links"
        :key="link._id"
        class="card flex items-center gap-4 group"
      >
        <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style="background-color: var(--surface-2);">
          {{ iconOptions.find(o => o.v === link.icon)?.l.split(' ')[0] ?? '🔗' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm">{{ link.label }}</p>
          <p class="text-xs truncate" style="color: var(--muted);">{{ link.url }}</p>
        </div>
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="openEdit(link)" class="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-white/5" style="border-color: var(--border); color: var(--muted);">
            Modifier
          </button>
          <button @click="remove(link._id)" class="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-red-500/10" style="border-color: var(--border); color: #f87171;">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
