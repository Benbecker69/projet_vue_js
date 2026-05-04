<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' });
useSeoMeta({ title: 'Statistiques — Smart Identity' });

const profileStore = useProfileStore();
await profileStore.fetchProfile();

const totalScans = computed(() =>
  profileStore.nfcObjects.reduce((sum, n) => sum + (n.scanCount || 0), 0)
);
</script>

<template>
  <div>
    <h1 class="text-3xl font-display font-bold mb-8">Statistiques</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <div class="card text-center py-10">
        <p class="text-5xl font-display font-bold gradient-text mb-2">{{ totalScans }}</p>
        <p style="color: var(--muted);">Scans totaux de vos bracelets</p>
      </div>
      <div class="card text-center py-10">
        <p class="text-5xl font-display font-bold gradient-text mb-2">{{ profileStore.nfcObjects.length }}</p>
        <p style="color: var(--muted);">Objets NFC enregistrés</p>
      </div>
    </div>

    <div v-if="profileStore.nfcObjects.length" class="card">
      <h2 class="font-display font-semibold mb-4">Détail par bracelet</h2>
      <div class="space-y-3">
        <div v-for="nfc in profileStore.nfcObjects" :key="nfc._id" class="flex items-center gap-4">
          <div class="flex-1">
            <div class="flex justify-between text-sm mb-1">
              <span>{{ nfc.label }}</span>
              <span class="font-semibold">{{ nfc.scanCount }} scans</span>
            </div>
            <div class="h-2 rounded-full overflow-hidden" style="background-color: var(--surface-2);">
              <div
                class="h-full gradient-bg rounded-full transition-all duration-500"
                :style="{ width: totalScans > 0 ? `${(nfc.scanCount / totalScans) * 100}%` : '0%' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
