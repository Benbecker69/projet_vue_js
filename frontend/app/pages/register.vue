<script setup lang="ts">
definePageMeta({ layout: false });

useSeoMeta({ title: 'Créer un compte — Smart Identity' });

const authStore = useAuthStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const confirm = ref('');
const error = ref('');
const fieldErrors = ref<Record<string, string>>({});

async function submit() {
  error.value = '';
  fieldErrors.value = {};

  if (password.value !== confirm.value) {
    fieldErrors.value.confirm = 'Les mots de passe ne correspondent pas';
    return;
  }
  if (password.value.length < 8) {
    fieldErrors.value.password = 'Au moins 8 caractères requis';
    return;
  }

  try {
    await authStore.register(name.value, email.value, password.value);
    router.push('/dashboard');
  } catch (e: any) {
    const apiError = e?.data?.error;
    if (apiError?.code === 'VALIDATION_ERROR' && apiError.details) {
      for (const d of apiError.details) {
        fieldErrors.value[d.field] = d.message;
      }
    } else {
      error.value = apiError?.message || 'Erreur lors de l\'inscription';
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--bg);">
    <div class="w-full max-w-md">
      <NuxtLink to="/" class="flex items-center justify-center gap-2 font-display font-bold text-xl mb-8">
        <span class="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold">SI</span>
        <span>Smart Identity</span>
      </NuxtLink>

      <div class="card">
        <h1 class="text-2xl font-display font-bold mb-2">Créer un compte</h1>
        <p class="text-sm mb-8" style="color: var(--muted);">
          Déjà inscrit ?
          <NuxtLink to="/login" style="color: var(--accent);">Se connecter</NuxtLink>
        </p>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Nom complet</label>
            <input v-model="name" type="text" placeholder="Jean Dupont" class="input-field" :class="{ 'border-red-500': fieldErrors.name }" required />
            <p v-if="fieldErrors.name" class="text-xs mt-1" style="color: #f87171;">{{ fieldErrors.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input v-model="email" type="email" placeholder="vous@exemple.fr" class="input-field" :class="{ 'border-red-500': fieldErrors.email }" required />
            <p v-if="fieldErrors.email" class="text-xs mt-1" style="color: #f87171;">{{ fieldErrors.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Mot de passe</label>
            <input v-model="password" type="password" placeholder="Min. 8 caractères" class="input-field" :class="{ 'border-red-500': fieldErrors.password }" required />
            <p v-if="fieldErrors.password" class="text-xs mt-1" style="color: #f87171;">{{ fieldErrors.password }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
            <input v-model="confirm" type="password" placeholder="••••••••" class="input-field" :class="{ 'border-red-500': fieldErrors.confirm }" required />
            <p v-if="fieldErrors.confirm" class="text-xs mt-1" style="color: #f87171;">{{ fieldErrors.confirm }}</p>
          </div>

          <div v-if="error" class="text-sm px-3 py-2 rounded-lg" style="background: rgba(239,68,68,0.1); color: #f87171;">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full py-3.5" :disabled="authStore.loading">
            {{ authStore.loading ? 'Création...' : 'Créer mon compte' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
