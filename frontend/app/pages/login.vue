<script setup lang="ts">
definePageMeta({ layout: false });

useSeoMeta({ title: 'Connexion — Smart Identity' });

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const error = ref('');

async function submit() {
  error.value = '';
  try {
    await authStore.login(email.value, password.value);
    const redirect = (route.query.redirect as string) || '/dashboard';
    router.push(redirect);
  } catch (e: any) {
    error.value = e?.data?.error?.message || authStore.error || 'Erreur de connexion';
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--bg);">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center justify-center gap-2 font-display font-bold text-xl mb-8">
        <span class="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold">SI</span>
        <span>Smart Identity</span>
      </NuxtLink>

      <div class="card">
        <h1 class="text-2xl font-display font-bold mb-2">Connexion</h1>
        <p class="text-sm mb-8" style="color: var(--muted);">
          Pas encore de compte ?
          <NuxtLink to="/register" style="color: var(--accent);">Créer un compte</NuxtLink>
        </p>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input v-model="email" type="email" placeholder="vous@exemple.fr" class="input-field" required autocomplete="email" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Mot de passe</label>
            <input v-model="password" type="password" placeholder="••••••••" class="input-field" required autocomplete="current-password" />
          </div>

          <div v-if="error" class="text-sm px-3 py-2 rounded-lg" style="background: rgba(239,68,68,0.1); color: #f87171;">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full py-3.5" :disabled="authStore.loading">
            {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="mt-4 pt-4 border-t text-xs text-center" style="border-color: var(--border); color: var(--muted);">
          Démo : demo@smart-identity.dev / password123
        </div>
      </div>
    </div>
  </div>
</template>
