<script setup lang="ts">
const authStore = useAuthStore();
const route = useRoute();

const navItems = [
  { label: 'Tableau de bord', href: '/dashboard', icon: 'grid' },
  { label: 'Mon profil', href: '/dashboard/profile', icon: 'user' },
  { label: 'Mes liens', href: '/dashboard/links', icon: 'link' },
  { label: 'Mes bracelets', href: '/dashboard/nfc', icon: 'cpu' },
  { label: 'Statistiques', href: '/dashboard/stats', icon: 'bar-chart' },
  { label: 'Mes commandes', href: '/dashboard/orders', icon: 'package' },
];

function isActive(href: string) {
  return route.path === href || (href !== '/dashboard' && route.path.startsWith(href));
}

const icons: Record<string, string> = {
  grid: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  cpu: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  'bar-chart': 'M18 20V10M12 20V4M6 20v-6',
  package: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01',
};
</script>

<template>
  <div class="min-h-screen flex" style="background-color: var(--bg); color: var(--text);">
    <!-- Sidebar -->
    <aside class="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 border-r" style="background-color: var(--surface); border-color: var(--border);">
      <!-- Logo -->
      <div class="flex items-center gap-2 h-16 px-6 border-b" style="border-color: var(--border);">
        <NuxtLink to="/" class="flex items-center gap-2 font-display font-bold text-lg">
          <span class="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold">SI</span>
          <span>Smart Identity</span>
        </NuxtLink>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="isActive(item.href)
            ? 'gradient-bg text-white shadow-lg'
            : 'hover:bg-white/5'"
          :style="isActive(item.href) ? '' : 'color: var(--muted)'"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" :d="icons[item.icon]" />
          </svg>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- User + Logout -->
      <div class="p-4 border-t" style="border-color: var(--border);">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
            {{ authStore.user?.name?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs truncate" style="color: var(--muted);">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <button @click="authStore.logout()" class="w-full text-left text-sm px-3 py-2 rounded-lg transition-colors hover:bg-white/5" style="color: var(--muted);">
          Se déconnecter
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 md:ml-64">
      <!-- Mobile header -->
      <header class="md:hidden flex items-center justify-between h-14 px-4 border-b glass" style="border-color: var(--border);">
        <NuxtLink to="/" class="font-display font-bold">Smart Identity</NuxtLink>
        <button @click="authStore.logout()" class="text-sm" style="color: var(--muted);">Déconnexion</button>
      </header>

      <main class="p-6 lg:p-8 max-w-5xl">
        <slot />
      </main>
    </div>
  </div>
</template>
