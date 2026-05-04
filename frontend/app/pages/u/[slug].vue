<script setup lang="ts">
definePageMeta({ layout: false });

const route = useRoute();
const config = useRuntimeConfig();

const { data, error } = await useFetch<any>(`${config.public.apiBase}/public/profile/${route.params.slug}`);

if (error.value) {
  throw createError({ statusCode: 404, message: 'Profil introuvable' });
}

const profile = computed(() => data.value);

useSeoMeta({
  title: computed(() => `${profile.value?.name} — Smart Identity`),
  description: computed(() => profile.value?.bio || `Profil de ${profile.value?.name}`),
  ogTitle: computed(() => profile.value?.name),
  ogDescription: computed(() => profile.value?.bio),
  ogImage: computed(() => profile.value?.avatar),
});

const iconEmoji: Record<string, string> = {
  link: '🔗', linkedin: '💼', github: '🐙', twitter: '🐦',
  instagram: '📸', globe: '🌐', mail: '✉️', phone: '📱',
};

const themeStyles = computed(() => {
  switch (profile.value?.theme) {
    case 'light':
      return { bg: '#F8F8FF', surface: '#FFFFFF', text: '#1a1a2e', muted: '#6B7280', accent: '#7C5CFF', border: 'rgba(0,0,0,0.08)' };
    case 'neon':
      return { bg: '#000510', surface: '#0a0a1a', text: '#00ff99', muted: '#00cc77', accent: '#00ff99', border: 'rgba(0,255,153,0.15)' };
    default:
      return { bg: '#0B0B10', surface: '#13131C', text: '#F4F4F5', muted: '#9CA3AF', accent: '#7C5CFF', border: 'rgba(255,255,255,0.08)' };
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-16"
    :style="{ backgroundColor: themeStyles.backgroundColor || themeStyles.bg, color: themeStyles.text }"
  >
    <div class="w-full max-w-sm">
      <!-- Profile card -->
      <div class="rounded-3xl p-8 text-center" :style="{ background: themeStyles.surface, border: `1px solid ${themeStyles.border}` }">
        <!-- Avatar -->
        <div class="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center" :style="{ background: `linear-gradient(135deg, ${themeStyles.accent}, #22D3EE)` }">
          <img v-if="profile?.avatar" :src="profile.avatar" :alt="profile?.name" class="w-full h-full object-cover" />
          <span v-else class="text-4xl text-white font-bold">{{ profile?.name?.charAt(0)?.toUpperCase() }}</span>
        </div>

        <h1 class="text-2xl font-display font-bold mb-2">{{ profile?.name }}</h1>
        <p v-if="profile?.bio" class="text-sm leading-relaxed mb-6" :style="{ color: themeStyles.muted }">{{ profile.bio }}</p>

        <!-- Links -->
        <div class="space-y-3">
          <a
            v-for="link in profile?.links"
            :key="link._id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
            :style="{ background: `rgba(124,92,255,0.12)`, border: `1px solid rgba(124,92,255,0.25)`, color: themeStyles.text }"
          >
            <span>{{ iconEmoji[link.icon] || '🔗' }}</span>
            <span>{{ link.label }}</span>
            <span class="ml-auto text-xs opacity-50">↗</span>
          </a>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-6" :style="{ borderTop: `1px solid ${themeStyles.border}` }">
          <NuxtLink to="/" class="text-xs" :style="{ color: themeStyles.muted }">
            Powered by <strong>Smart Identity</strong>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
