<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message?: string } }>();
const handleError = () => clearError({ redirect: '/' });

const is404 = computed(() => props.error?.statusCode === 404);
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--bg); color: var(--text);">
    <div class="text-center max-w-md">
      <p class="text-8xl font-display font-bold gradient-text mb-4">
        {{ error.statusCode }}
      </p>
      <h1 class="text-2xl font-display font-bold mb-3">
        {{ is404 ? 'Page introuvable' : 'Une erreur est survenue' }}
      </h1>
      <p class="text-sm mb-8" style="color: var(--muted);">
        {{ is404
          ? 'Cette page n\'existe pas ou a été déplacée.'
          : error.message || 'Quelque chose s\'est mal passé de notre côté.' }}
      </p>
      <div class="flex gap-3 justify-center">
        <button @click="handleError" class="btn-primary">
          Retour à l'accueil
        </button>
        <button @click="$router.back()" class="btn-ghost">
          Page précédente
        </button>
      </div>
    </div>
  </div>
</template>
