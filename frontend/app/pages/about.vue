<script setup lang="ts">
definePageMeta({ layout: 'marketing' });

useSeoMeta({
  title: 'À propos — Smart Identity',
  description: 'Découvrez l\'histoire et la mission de Smart Identity, la startup phygitale qui réinvente le partage de profil professionnel.',
});

const team = [
  { name: 'Sophie Laurent', role: 'CEO & Co-fondatrice', avatar: 'https://i.pravatar.cc/200?img=1' },
  { name: 'Théo Berger', role: 'CTO & Co-fondateur', avatar: 'https://i.pravatar.cc/200?img=3' },
  { name: 'Camille Roux', role: 'Head of Design', avatar: 'https://i.pravatar.cc/200?img=5' },
];

const values = [
  { emoji: '⚡', title: 'Simplicité radicale', desc: 'Aucune friction. Votre profil est accessible en un scan, sans app, sans login.' },
  { emoji: '🔒', title: 'Contrôle total', desc: 'Vous gérez ce que vous partagez, quand vous le partagez. Désactivez en un clic.' },
  { emoji: '🌱', title: 'Durable', desc: 'Fini les cartes de visite papier. Un bracelet remplace des milliers de cartes jetées.' },
];
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="py-32 text-center">
      <div class="section-container">
        <h1 class="text-5xl font-display font-bold mb-6">
          Réinventer le <span class="gradient-text">networking</span>
        </h1>
        <p class="text-xl max-w-2xl mx-auto" style="color: var(--muted);">
          Smart Identity est née d'un constat simple : échanger des cartes de visite en 2025, c'est absurde. Il fallait quelque chose d'élégant, d'instantané, de vivant.
        </p>
      </div>
    </section>

    <!-- Mission -->
    <section class="py-20" style="background-color: var(--surface);">
      <div class="section-container max-w-3xl">
        <h2 class="text-3xl font-display font-bold mb-6">Notre mission</h2>
        <p class="text-lg leading-relaxed mb-6" style="color: var(--muted);">
          Nous croyons que votre identité professionnelle mérite d'être aussi agile que vous. Smart Identity vous offre un objet physique élégant couplé à un profil numérique vivant — que vous pouvez mettre à jour à tout moment, depuis n'importe où.
        </p>
        <p class="text-lg leading-relaxed" style="color: var(--muted);">
          Fondée en 2024 à Paris, notre équipe réunit des expertises en design, hardware NFC et développement full-stack. Nous construisons l'identité numérique de demain.
        </p>
      </div>
    </section>

    <!-- Values -->
    <section class="py-20">
      <div class="section-container">
        <h2 class="text-3xl font-display font-bold mb-12 text-center">Nos valeurs</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="v in values" :key="v.title" class="card text-center">
            <div class="text-4xl mb-4">{{ v.emoji }}</div>
            <h3 class="font-display font-bold text-lg mb-2">{{ v.title }}</h3>
            <p class="text-sm" style="color: var(--muted);">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-20" style="background-color: var(--surface);">
      <div class="section-container">
        <h2 class="text-3xl font-display font-bold mb-12 text-center">L'équipe</h2>
        <div class="flex flex-wrap justify-center gap-10">
          <div v-for="member in team" :key="member.name" class="text-center w-40">
            <img :src="member.avatar" :alt="member.name" class="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-2" style="ring-color: var(--accent);" />
            <p class="font-semibold text-sm">{{ member.name }}</p>
            <p class="text-xs mt-1" style="color: var(--muted);">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
