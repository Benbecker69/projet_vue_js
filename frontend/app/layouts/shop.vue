<script setup lang="ts">
const authStore = useAuthStore();
const cartStore = useCartStore();
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--bg); color: var(--text);">
    <header class="fixed top-0 left-0 right-0 z-50 glass border-b" style="border-color: var(--border);">
      <nav class="section-container flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2 font-display font-bold text-xl">
          <span class="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-sm font-bold">SI</span>
          <span>Boutique</span>
        </NuxtLink>

        <div class="flex items-center gap-4">
          <NuxtLink to="/shop" class="text-sm transition-colors" style="color: var(--muted);" active-class="!text-white">
            Catalogue
          </NuxtLink>

          <!-- Cart -->
          <NuxtLink to="/cart" class="relative flex items-center gap-1.5 text-sm transition-colors" style="color: var(--muted);" active-class="!text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span v-if="cartStore.count > 0" class="absolute -top-2 -right-2 w-4 h-4 gradient-bg text-white text-xs rounded-full flex items-center justify-center">
              {{ cartStore.count }}
            </span>
          </NuxtLink>

          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/dashboard" class="btn-ghost text-sm py-2">Mon espace</NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="btn-primary text-sm py-2">Se connecter</NuxtLink>
          </template>
        </div>
      </nav>
    </header>

    <main class="pt-16">
      <slot />
    </main>

    <footer class="mt-16 py-8 border-t" style="border-color: var(--border);">
      <div class="section-container text-center text-sm" style="color: var(--muted);">
        <NuxtLink to="/" class="hover:text-white transition-colors">← Retour au site</NuxtLink>
        <span class="mx-3">·</span>
        <span>© 2025 Smart Identity</span>
      </div>
    </footer>
  </div>
</template>
