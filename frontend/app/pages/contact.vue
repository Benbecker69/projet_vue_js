<script setup lang="ts">
definePageMeta({ layout: 'marketing' });

useSeoMeta({
  title: 'Contact — Smart Identity',
  description: 'Contactez l\'équipe Smart Identity pour toute question, partenariat ou support.',
});

const form = reactive({ name: '', email: '', message: '' });
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const errorMsg = ref('');

async function submit() {
  if (!form.name || !form.email || !form.message) {
    errorMsg.value = 'Veuillez remplir tous les champs.';
    status.value = 'error';
    return;
  }
  status.value = 'loading';
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    status.value = 'success';
    form.name = '';
    form.email = '';
    form.message = '';
  } catch {
    status.value = 'error';
    errorMsg.value = 'Une erreur est survenue. Veuillez réessayer.';
  }
}
</script>

<template>
  <div>
    <section class="py-32">
      <div class="section-container max-w-2xl">
        <h1 class="text-5xl font-display font-bold mb-4">
          <span class="gradient-text">Contactez-nous</span>
        </h1>
        <p class="text-lg mb-12" style="color: var(--muted);">
          Une question, un partenariat, ou juste dire bonjour — on vous répond sous 24h.
        </p>

        <div v-if="status === 'success'" class="card text-center py-12">
          <div class="text-5xl mb-4">✅</div>
          <h2 class="text-2xl font-display font-bold mb-2">Message envoyé !</h2>
          <p style="color: var(--muted);">On vous répond dans les 24h.</p>
          <button class="btn-primary mt-6" @click="status = 'idle'">Envoyer un autre message</button>
        </div>

        <form v-else @submit.prevent="submit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Nom complet</label>
            <input v-model="form.name" type="text" placeholder="Jean Dupont" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input v-model="form.email" type="email" placeholder="jean@exemple.fr" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Message</label>
            <textarea v-model="form.message" rows="5" placeholder="Votre message..." class="input-field resize-none" required />
          </div>

          <p v-if="status === 'error'" class="text-sm px-3 py-2 rounded-lg" style="background: rgba(239,68,68,0.1); color: #f87171;">
            {{ errorMsg }}
          </p>

          <button type="submit" class="btn-primary w-full py-4" :disabled="status === 'loading'">
            {{ status === 'loading' ? 'Envoi...' : 'Envoyer le message' }}
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
