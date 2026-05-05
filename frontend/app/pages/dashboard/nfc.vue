<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' });
useSeoMeta({ title: 'Mes bracelets — Smart Identity' });

const profileStore = useProfileStore();
const config = useRuntimeConfig();
const toast = useToast();
await profileStore.fetchProfile();

const newLabel = ref('');
const creating = ref(false);
const scanning = ref<string | null>(null);
const slug = computed(() => profileStore.profile?.profile?.publicSlug);

async function create() {
  if (!newLabel.value.trim()) return;
  creating.value = true;
  try {
    await profileStore.createNfc(newLabel.value);
    toast.success('Bracelet créé avec succès');
    newLabel.value = '';
  } catch {
    toast.error('Impossible de créer le bracelet');
  } finally {
    creating.value = false;
  }
}

async function simulateScan(nfc: any) {
  scanning.value = nfc._id;
  try {
    const data = await $fetch<{ slug: string }>(`${config.public.apiBase}/public/nfc/${nfc.code}/scan`, {
      method: 'POST',
    });
    nfc.scanCount++;
    if (data.slug) {
      window.open(`/u/${data.slug}`, '_blank');
    }
  } catch {
    toast.error('Erreur lors de la simulation du scan');
  } finally {
    scanning.value = null;
  }
}

async function remove(id: string) {
  try {
    await profileStore.deleteNfc(id);
    toast.success('Bracelet supprimé');
  } catch {
    toast.error('Impossible de supprimer ce bracelet');
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-display font-bold">Mes bracelets NFC</h1>
    </div>

    <!-- Create form -->
    <div class="card mb-8">
      <h2 class="font-display font-semibold mb-4">Associer un nouveau bracelet</h2>
      <div class="flex gap-3">
        <input v-model="newLabel" type="text" placeholder="Ex: Mon bracelet pro" class="input-field flex-1" @keyup.enter="create" />
        <button @click="create" class="btn-primary px-6" :disabled="creating || !newLabel.trim()">
          {{ creating ? '...' : 'Créer' }}
        </button>
      </div>
      <p class="text-xs mt-2" style="color: var(--muted);">Un code NFC unique sera généré automatiquement pour ce bracelet.</p>
    </div>

    <!-- List -->
    <div v-if="profileStore.nfcObjects.length === 0" class="text-center py-16">
      <div class="text-5xl mb-4">📿</div>
      <p class="font-display font-semibold mb-2">Aucun bracelet associé</p>
      <p class="text-sm" style="color: var(--muted);">Créez votre premier objet NFC ci-dessus.</p>
    </div>

    <div class="space-y-4">
      <div v-for="nfc in profileStore.nfcObjects" :key="nfc._id" class="card">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white text-xl flex-shrink-0">
              📿
            </div>
            <div>
              <p class="font-semibold">{{ nfc.label }}</p>
              <p class="text-xs font-mono mt-0.5" style="color: var(--muted);">{{ nfc.code }}</p>
              <p class="text-xs mt-1" style="color: var(--muted);">{{ nfc.scanCount }} scan(s)</p>
            </div>
          </div>

          <div class="flex gap-2 flex-shrink-0">
            <button
              @click="simulateScan(nfc)"
              :disabled="scanning === nfc._id || !slug"
              class="btn-secondary text-sm py-2"
              :title="!slug ? 'Configurez votre slug d\'abord' : 'Simuler un scan NFC'"
            >
              {{ scanning === nfc._id ? '⏳ Scan...' : '📱 Simuler le scan' }}
            </button>
            <button @click="remove(nfc._id)" class="btn-ghost text-sm py-2" style="color: #f87171;">
              Supprimer
            </button>
          </div>
        </div>

        <div v-if="!slug" class="mt-3 text-xs px-3 py-2 rounded-lg" style="background: rgba(124,92,255,0.1); color: var(--accent);">
          ⚠️ Configurez votre slug dans <NuxtLink to="/dashboard/profile" class="underline">Mon profil</NuxtLink> pour activer la simulation NFC.
        </div>
      </div>
    </div>
  </div>
</template>
