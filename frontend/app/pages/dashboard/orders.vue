<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' });
useSeoMeta({ title: 'Mes commandes — Smart Identity' });

const authStore = useAuthStore();
const config = useRuntimeConfig();

const { data, pending, error } = await useFetch<{ orders: any[] }>(`${config.public.apiBase}/me/orders`, {
  headers: { Authorization: `Bearer ${authStore.token}` },
});
const orders = computed(() => data.value?.orders ?? []);

const statusLabel: Record<string, string> = {
  pending: '⏳ En attente',
  paid: '✅ Payée',
  shipped: '📦 Expédiée',
  cancelled: '❌ Annulée',
};
</script>

<template>
  <div>
    <h1 class="text-3xl font-display font-bold mb-8">Mes commandes</h1>

    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card animate-pulse">
        <div class="flex justify-between mb-4">
          <div class="space-y-2">
            <div class="h-3 w-24 rounded" style="background-color: var(--surface-2);"></div>
            <div class="h-3 w-16 rounded" style="background-color: var(--surface-2);"></div>
          </div>
          <div class="h-6 w-20 rounded-full" style="background-color: var(--surface-2);"></div>
        </div>
        <div class="h-3 w-48 rounded" style="background-color: var(--surface-2);"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-16">
      <div class="text-5xl mb-4">⚠️</div>
      <p class="font-display font-semibold mb-2">Impossible de charger les commandes</p>
      <p class="text-sm" style="color: var(--muted);">Vérifiez votre connexion et réessayez.</p>
    </div>

    <!-- Empty -->
    <div v-else-if="orders.length === 0" class="text-center py-16">
      <div class="text-5xl mb-4">📦</div>
      <p class="font-display font-semibold mb-2">Aucune commande</p>
      <p class="text-sm mb-6" style="color: var(--muted);">Vous n'avez pas encore passé de commande.</p>
      <NuxtLink to="/shop" class="btn-primary">Découvrir la boutique</NuxtLink>
    </div>

    <!-- List -->
    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order._id" class="card">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <p class="font-mono text-sm" style="color: var(--muted);">#{{ order._id.slice(-8).toUpperCase() }}</p>
            <p class="text-xs mt-1" style="color: var(--muted);">{{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}</p>
          </div>
          <div class="text-right">
            <span class="text-xs px-2 py-1 rounded-full" style="background-color: var(--surface-2);">
              {{ statusLabel[order.status] || order.status }}
            </span>
            <p class="font-bold mt-1 gradient-text">{{ order.total.toFixed(2) }} €</p>
          </div>
        </div>
        <div class="space-y-1">
          <div v-for="item in order.items" :key="item.variantSku" class="flex justify-between text-sm">
            <span style="color: var(--muted);">{{ item.name }} × {{ item.qty }}</span>
            <span>{{ (item.unitPrice * item.qty).toFixed(2) }} €</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
