<script setup lang="ts">
const authStore = useAuthStore();
const cartStore = useCartStore();
const mobileMenuOpen = ref(false);

const navLinks = [
  { label: 'Fonctionnalités', href: '/#features' },
  { label: 'Tarifs', href: '/shop' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--bg); color: var(--text);">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 glass border-b" style="border-color: var(--border);">
      <nav class="section-container flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 font-display font-bold text-xl">
          <span class="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-sm font-bold">SI</span>
          <span>Smart Identity</span>
        </NuxtLink>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-6">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            :to="link.href"
            class="text-sm transition-colors"
            style="color: var(--muted);"
            active-class="!text-white"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <NuxtLink to="/shop" class="relative">
            <span class="text-sm" style="color: var(--muted);">Boutique</span>
            <span
              v-if="cartStore.count > 0"
              class="absolute -top-2 -right-3 w-4 h-4 gradient-bg text-white text-xs rounded-full flex items-center justify-center"
            >{{ cartStore.count }}</span>
          </NuxtLink>

          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/dashboard" class="btn-primary text-sm py-2">
              Mon espace
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="btn-ghost text-sm py-2">Connexion</NuxtLink>
            <NuxtLink to="/register" class="btn-primary text-sm py-2">Créer un compte</NuxtLink>
          </template>
        </div>
      </nav>
    </header>

    <!-- Page content -->
    <main class="pt-16">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="mt-24 py-12 border-t" style="border-color: var(--border);">
      <div class="section-container">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-2 font-display font-bold">
            <span class="w-6 h-6 rounded gradient-bg flex items-center justify-center text-white text-xs font-bold">SI</span>
            <span>Smart Identity</span>
          </div>
          <div class="flex gap-6 text-sm" style="color: var(--muted);">
            <NuxtLink to="/about" class="hover:text-white transition-colors">À propos</NuxtLink>
            <NuxtLink to="/contact" class="hover:text-white transition-colors">Contact</NuxtLink>
            <NuxtLink to="/shop" class="hover:text-white transition-colors">Boutique</NuxtLink>
          </div>
          <p class="text-sm" style="color: var(--muted);">© 2025 Smart Identity. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
