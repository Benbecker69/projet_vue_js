<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' });
useSeoMeta({ title: 'Tableau de bord — Smart Identity' });

const authStore = useAuthStore();
const profileStore = useProfileStore();

await profileStore.fetchProfile();

const totalScans = computed(() =>
  profileStore.nfcObjects.reduce((sum, n) => sum + (n.scanCount || 0), 0)
);
const activeNfc = computed(() =>
  profileStore.nfcObjects.filter(n => n.isActive).length
);
const slug = computed(() => profileStore.profile?.profile?.publicSlug);
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-display font-bold mb-1">
        Bonjour, {{ authStore.user?.name?.split(' ')[0] }} 👋
      </h1>
      <p style="color: var(--muted);">Gérez votre identité numérique depuis ce tableau de bord.</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="card text-center py-8">
        <p class="text-4xl font-display font-bold gradient-text mb-2">{{ totalScans }}</p>
        <p class="text-sm" style="color: var(--muted);">Scans totaux</p>
      </div>
      <div class="card text-center py-8">
        <p class="text-4xl font-display font-bold gradient-text mb-2">{{ activeNfc }}</p>
        <p class="text-sm" style="color: var(--muted);">Bracelets actifs</p>
      </div>
      <div class="card text-center py-8">
        <p class="text-4xl font-display font-bold gradient-text mb-2">{{ profileStore.profile?.profile?.links?.length ?? 0 }}</p>
        <p class="text-sm" style="color: var(--muted);">Liens partagés</p>
      </div>
    </div>

    <!-- Page publique -->
    <div class="card mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-display font-semibold text-lg mb-1">Votre page publique</h2>
          <p class="text-sm" style="color: var(--muted);">
            <template v-if="slug">
              Accessible à : <code class="px-1.5 py-0.5 rounded text-xs" style="background-color: var(--surface-2);">/u/{{ slug }}</code>
            </template>
            <template v-else>Configurez un slug dans votre profil.</template>
          </p>
        </div>
        <NuxtLink v-if="slug" :to="`/u/${slug}`" target="_blank" class="btn-primary text-sm py-2">
          Voir ma page →
        </NuxtLink>
        <NuxtLink v-else to="/dashboard/profile" class="btn-secondary text-sm py-2">Configurer</NuxtLink>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink to="/dashboard/links" class="card hover:border-accent/40 transition-all group">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <div>
            <p class="font-semibold">Gérer mes liens</p>
            <p class="text-sm" style="color: var(--muted);">Ajoutez vos réseaux, portfolio, contact</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/dashboard/nfc" class="card hover:border-accent/40 transition-all group">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
            </svg>
          </div>
          <div>
            <p class="font-semibold">Mes bracelets NFC</p>
            <p class="text-sm" style="color: var(--muted);">Simulez un scan, suivez les stats</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
