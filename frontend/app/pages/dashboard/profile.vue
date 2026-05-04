<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' });
useSeoMeta({ title: 'Mon profil — Smart Identity' });

const profileStore = useProfileStore();
await profileStore.fetchProfile();

const form = reactive({
  bio: profileStore.profile?.profile?.bio ?? '',
  avatar: profileStore.profile?.profile?.avatar ?? '',
  theme: profileStore.profile?.profile?.theme ?? 'dark',
  publicSlug: profileStore.profile?.profile?.publicSlug ?? '',
});

const saving = ref(false);
const saved = ref(false);
const error = ref('');

async function save() {
  saving.value = true;
  error.value = '';
  try {
    await profileStore.updateProfile(form);
    saved.value = true;
    setTimeout(() => saved.value = false, 2500);
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Erreur lors de la sauvegarde';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="max-w-xl">
    <h1 class="text-3xl font-display font-bold mb-8">Mon profil</h1>

    <form @submit.prevent="save" class="space-y-6">
      <!-- Avatar preview -->
      <div class="flex items-center gap-4 mb-2">
        <div class="w-16 h-16 rounded-full overflow-hidden gradient-bg flex items-center justify-center flex-shrink-0">
          <img v-if="form.avatar" :src="form.avatar" alt="Avatar" class="w-full h-full object-cover" />
          <span v-else class="text-2xl text-white font-bold">
            {{ profileStore.profile?.name?.charAt(0)?.toUpperCase() }}
          </span>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium mb-2">URL de votre avatar</label>
          <input v-model="form.avatar" type="url" placeholder="https://..." class="input-field" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Bio <span style="color: var(--muted);">(max 500 caractères)</span></label>
        <textarea v-model="form.bio" rows="3" maxlength="500" placeholder="Décrivez-vous en quelques mots..." class="input-field resize-none" />
        <p class="text-xs mt-1 text-right" style="color: var(--muted);">{{ form.bio.length }}/500</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Slug de votre page publique</label>
        <div class="flex items-center">
          <span class="px-3 py-3 rounded-l-xl text-sm border border-r-0" style="background-color: var(--surface-2); border-color: var(--border); color: var(--muted);">
            smart-identity.dev/u/
          </span>
          <input v-model="form.publicSlug" type="text" placeholder="votre-nom" class="input-field rounded-l-none flex-1" pattern="[a-z0-9-]+" />
        </div>
        <p class="text-xs mt-1" style="color: var(--muted);">Lettres minuscules, chiffres et tirets uniquement.</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-3">Thème de votre page publique</label>
        <div class="flex gap-3">
          <label
            v-for="t in [{ v: 'dark', l: '🌑 Sombre' }, { v: 'light', l: '☀️ Clair' }, { v: 'neon', l: '⚡ Néon' }]"
            :key="t.v"
            class="flex-1 text-center py-3 rounded-xl border-2 cursor-pointer text-sm transition-all"
            :style="form.theme === t.v ? 'border-color: var(--accent); color: var(--accent); background: rgba(124,92,255,0.1)' : 'border-color: var(--border); color: var(--muted)'"
          >
            <input type="radio" :value="t.v" v-model="form.theme" class="sr-only" />
            {{ t.l }}
          </label>
        </div>
      </div>

      <p v-if="error" class="text-sm px-3 py-2 rounded-lg" style="background: rgba(239,68,68,0.1); color: #f87171;">
        {{ error }}
      </p>

      <button type="submit" class="btn-primary w-full py-3.5" :disabled="saving">
        {{ saved ? '✓ Enregistré !' : saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
      </button>
    </form>
  </div>
</template>
