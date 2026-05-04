<script setup lang="ts">
definePageMeta({ layout: 'shop' });
useSeoMeta({ title: 'Panier — Smart Identity' });

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

function proceedToCheckout() {
  if (!authStore.isAuthenticated) {
    router.push('/login?redirect=/checkout');
  } else {
    router.push('/checkout');
  }
}
</script>

<template>
  <div class="py-16 section-container max-w-3xl">
    <h1 class="text-3xl font-display font-bold mb-8">Votre panier</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">🛒</div>
      <p class="text-xl font-display font-semibold mb-2">Votre panier est vide</p>
      <p class="mb-8" style="color: var(--muted);">Découvrez notre collection de bracelets NFC.</p>
      <NuxtLink to="/shop" class="btn-primary">Voir la boutique</NuxtLink>
    </div>

    <div v-else>
      <div class="space-y-4 mb-8">
        <div
          v-for="item in cartStore.items"
          :key="`${item.productId}-${item.variantSku}`"
          class="card flex items-center gap-4"
        >
          <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate">{{ item.name }}</p>
            <p class="text-sm" style="color: var(--muted);">{{ item.variantColor }}</p>
          </div>

          <!-- Qty -->
          <div class="flex items-center gap-2 rounded-lg border px-2 py-1" style="border-color: var(--border);">
            <button @click="cartStore.updateQty(item.productId, item.variantSku, item.qty - 1)" class="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded">−</button>
            <span class="text-sm w-4 text-center">{{ item.qty }}</span>
            <button @click="cartStore.updateQty(item.productId, item.variantSku, item.qty + 1)" class="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded">+</button>
          </div>

          <p class="font-bold w-20 text-right">{{ (item.price * item.qty).toFixed(2) }} €</p>

          <button @click="cartStore.remove(item.productId, item.variantSku)" class="p-2 rounded-lg hover:bg-white/5 transition-colors" style="color: var(--muted);">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Summary -->
      <div class="card p-6">
        <div class="flex justify-between text-lg font-bold mb-6">
          <span>Total</span>
          <span class="gradient-text">{{ cartStore.total.toFixed(2) }} €</span>
        </div>
        <button @click="proceedToCheckout" class="btn-primary w-full py-4 text-base">
          {{ authStore.isAuthenticated ? 'Passer la commande →' : 'Se connecter pour commander →' }}
        </button>
        <NuxtLink to="/shop" class="block text-center text-sm mt-3 transition-colors hover:text-white" style="color: var(--muted);">
          Continuer mes achats
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
