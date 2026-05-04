<script setup lang="ts">
definePageMeta({ layout: 'shop', middleware: 'auth' });
useSeoMeta({ title: 'Commande — Smart Identity' });

const cartStore = useCartStore();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const router = useRouter();

const form = reactive({
  fullName: authStore.user?.name || '',
  line1: '',
  city: '',
  postalCode: '',
  country: 'FR',
});

const loading = ref(false);
const error = ref('');
const orderId = ref('');

if (cartStore.items.length === 0) {
  navigateTo('/shop');
}

async function submitOrder() {
  loading.value = true;
  error.value = '';
  try {
    const data = await $fetch<{ order: any }>(`${config.public.apiBase}/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: {
        items: cartStore.items.map(i => ({
          productId: i.productId,
          variantSku: i.variantSku,
          qty: i.qty,
        })),
        shippingAddress: form,
      },
    });
    orderId.value = data.order._id;
    cartStore.clear();
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="py-16 section-container max-w-3xl">
    <!-- Success state -->
    <div v-if="orderId" class="text-center py-16">
      <div class="text-6xl mb-6">🎉</div>
      <h1 class="text-3xl font-display font-bold mb-4">Commande confirmée !</h1>
      <p class="mb-2" style="color: var(--muted);">Votre commande a été enregistrée avec succès.</p>
      <p class="text-sm font-mono px-3 py-1 rounded-lg inline-block mb-8" style="background-color: var(--surface);">
        #{{ orderId }}
      </p>
      <div class="flex gap-4 justify-center">
        <NuxtLink to="/dashboard/orders" class="btn-primary">Voir mes commandes</NuxtLink>
        <NuxtLink to="/shop" class="btn-ghost">Continuer mes achats</NuxtLink>
      </div>
    </div>

    <!-- Checkout form -->
    <div v-else>
      <h1 class="text-3xl font-display font-bold mb-8">Finaliser la commande</h1>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Address form -->
        <div class="lg:col-span-3 space-y-4">
          <h2 class="font-display font-semibold text-lg mb-4">Adresse de livraison</h2>
          <div>
            <label class="block text-sm font-medium mb-2">Nom complet</label>
            <input v-model="form.fullName" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Adresse</label>
            <input v-model="form.line1" type="text" placeholder="12 rue de la Paix" class="input-field" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Ville</label>
              <input v-model="form.city" type="text" placeholder="Paris" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Code postal</label>
              <input v-model="form.postalCode" type="text" placeholder="75001" class="input-field" required />
            </div>
          </div>

          <p v-if="error" class="text-sm px-3 py-2 rounded-lg" style="background: rgba(239,68,68,0.1); color: #f87171;">
            {{ error }}
          </p>
        </div>

        <!-- Order summary -->
        <div class="lg:col-span-2">
          <div class="card">
            <h2 class="font-display font-semibold mb-4">Récapitulatif</h2>
            <div class="space-y-3 mb-4">
              <div v-for="item in cartStore.items" :key="`${item.productId}-${item.variantSku}`" class="flex justify-between text-sm">
                <span style="color: var(--muted);">{{ item.name }} x{{ item.qty }}</span>
                <span>{{ (item.price * item.qty).toFixed(2) }} €</span>
              </div>
            </div>
            <div class="border-t pt-4 flex justify-between font-bold" style="border-color: var(--border);">
              <span>Total</span>
              <span class="gradient-text">{{ cartStore.total.toFixed(2) }} €</span>
            </div>

            <button @click="submitOrder" class="btn-primary w-full py-3.5 mt-6" :disabled="loading">
              {{ loading ? 'Traitement...' : 'Confirmer la commande' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
