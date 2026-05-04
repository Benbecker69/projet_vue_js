<script setup lang="ts">
definePageMeta({ layout: 'marketing' });

useSeoMeta({
  title: 'Smart Identity — Votre identité, en un geste',
  description: 'Partagez votre profil professionnel en un simple scan NFC. Bracelet, carte, porte-clé — votre identité connectée.',
  ogTitle: 'Smart Identity — Votre identité, en un geste',
  ogDescription: 'Partagez votre profil professionnel en un simple scan NFC.',
});

const config = useRuntimeConfig();
const { data: featuresData } = await useFetch<{ items: any[] }>(`${config.public.apiBase}/marketing/feature`);
const { data: testimonialsData } = await useFetch<{ items: any[] }>(`${config.public.apiBase}/marketing/testimonial`);

const features = computed(() => featuresData.value?.items ?? []);
const testimonials = computed(() => testimonialsData.value?.items ?? []);

const iconPaths: Record<string, string> = {
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  'refresh-cw': 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  smartphone: 'M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zM12 18h.01',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'bar-chart-2': 'M18 20V10M12 20V4M6 20v-6',
};

const useCases = [
  { icon: '💼', title: 'Networking pro', desc: 'Lors de vos rendez-vous clients ou salons, partagez votre profil LinkedIn, portfolio et coordonnées en un scan.' },
  { icon: '🎨', title: 'Profil créatif', desc: 'Photographes, designers, artistes — laissez votre travail parler. Votre bracelet devient votre portfolio ambulant.' },
  { icon: '🚀', title: 'Freelancing', desc: 'Convertissez plus de prospects. Votre page personnalisée contient tout ce qu\'il faut pour être rappelé.' },
];
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background glow -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style="background: radial-gradient(circle, var(--accent) 0%, transparent 70%);" />
      </div>

      <div class="section-container text-center relative z-10 py-32">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 glass" style="color: var(--accent);">
          <span class="w-2 h-2 rounded-full gradient-bg animate-pulse"></span>
          Phygital · NFC · Identité numérique
        </div>

        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
          Votre identité,<br>
          <span class="gradient-text">en un geste.</span>
        </h1>

        <p class="text-xl max-w-2xl mx-auto mb-10" style="color: var(--muted);">
          Un bracelet NFC. Une page publique personnalisée. Partagez votre profil pro instantanément — sans app, sans friction.
        </p>

        <div class="flex flex-wrap gap-4 justify-center">
          <NuxtLink to="/shop" class="btn-primary text-base px-8 py-4">
            Découvrir les produits
          </NuxtLink>
          <NuxtLink to="/u/alex-martin" class="btn-secondary text-base px-8 py-4" target="_blank">
            Voir une démo →
          </NuxtLink>
        </div>

        <!-- Stats -->
        <div class="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div v-for="stat in [{ n: '3s', l: 'Pour partager' }, { n: '100%', l: 'Sans app' }, { n: '∞', l: 'Mises à jour' }]" :key="stat.l" class="text-center">
            <p class="text-3xl font-display font-bold gradient-text">{{ stat.n }}</p>
            <p class="text-sm mt-1" style="color: var(--muted);">{{ stat.l }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-24">
      <div class="section-container">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-display font-bold mb-4">Tout ce dont vous avez besoin</h2>
          <p class="text-lg" style="color: var(--muted);">Une plateforme complète pour gérer et partager votre identité numérique.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in features"
            :key="feature._id"
            class="card group hover:border-accent/30 transition-all duration-300"
          >
            <div class="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-4">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[feature.meta?.icon] || iconPaths.zap" />
              </svg>
            </div>
            <h3 class="font-display font-semibold text-lg mb-2">{{ feature.title }}</h3>
            <p class="text-sm leading-relaxed" style="color: var(--muted);">{{ feature.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Use cases -->
    <section class="py-24" style="background-color: var(--surface);">
      <div class="section-container">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-display font-bold mb-4">Pour qui ?</h2>
          <p class="text-lg" style="color: var(--muted);">Smart Identity s'adapte à tous les profils créatifs et professionnels.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="uc in useCases" :key="uc.title" class="text-center p-8">
            <div class="text-5xl mb-4">{{ uc.icon }}</div>
            <h3 class="font-display font-bold text-xl mb-3">{{ uc.title }}</h3>
            <p style="color: var(--muted);">{{ uc.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section v-if="testimonials.length" class="py-24">
      <div class="section-container">
        <h2 class="text-4xl font-display font-bold text-center mb-16">Ce qu'ils en disent</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="t in testimonials" :key="t._id" class="card">
            <p class="text-sm leading-relaxed mb-6" style="color: var(--muted);">"{{ t.body }}"</p>
            <div class="flex items-center gap-3">
              <img :src="t.meta?.avatar" :alt="t.title" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <p class="text-sm font-semibold">{{ t.title }}</p>
                <p class="text-xs" style="color: var(--muted);">{{ t.meta?.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(ellipse at center, rgba(124,92,255,0.08) 0%, transparent 70%);" />
      <div class="section-container text-center relative z-10">
        <h2 class="text-4xl font-display font-bold mb-4">Prêt à partager votre identité ?</h2>
        <p class="text-lg mb-8" style="color: var(--muted);">Rejoignez des milliers de professionnels qui utilisent Smart Identity au quotidien.</p>
        <div class="flex flex-wrap gap-4 justify-center">
          <NuxtLink to="/register" class="btn-primary text-base px-8 py-4">Créer un compte gratuit</NuxtLink>
          <NuxtLink to="/shop" class="btn-ghost text-base px-8 py-4">Commander un bracelet</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
