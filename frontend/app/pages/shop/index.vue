<script setup lang="ts">
definePageMeta({ layout: 'shop' });

useSeoMeta({
  title: 'Boutique — Smart Identity',
  description: 'Bracelets, cartes et porte-clés NFC Smart Identity. Trouvez le produit qui correspond à votre style.',
});

const config = useRuntimeConfig();
const { data, pending } = await useFetch<{ products: any[] }>(`${config.public.apiBase}/products`);
const products = computed(() => data.value?.products ?? []);
</script>

<template>
  <div class="py-16 section-container">
    <div class="mb-12">
      <h1 class="text-4xl font-display font-bold mb-3">Notre collection</h1>
      <p style="color: var(--muted);">Des objets NFC conçus pour durer, avec votre identité à l'intérieur.</p>
    </div>

    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="card animate-pulse">
        <div class="w-full h-48 rounded-xl mb-4" style="background-color: var(--surface-2);"></div>
        <div class="h-4 rounded mb-2" style="background-color: var(--surface-2); width: 70%;"></div>
        <div class="h-3 rounded" style="background-color: var(--surface-2); width: 40%;"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="product in products"
        :key="product._id"
        :to="`/shop/${product.slug}`"
        class="card group cursor-pointer hover:border-accent/40 transition-all duration-300 hover:-translate-y-1"
      >
        <div class="overflow-hidden rounded-xl mb-4 bg-surface-2" style="background-color: var(--surface-2);">
          <img
            :src="product.images[0]"
            :alt="product.name"
            class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div class="flex items-start justify-between gap-2">
          <h2 class="font-display font-semibold text-base leading-tight">{{ product.name }}</h2>
          <span class="text-lg font-bold gradient-text flex-shrink-0">{{ product.price }}€</span>
        </div>

        <div class="flex gap-1.5 mt-3 flex-wrap">
          <span
            v-for="v in product.variants"
            :key="v.sku"
            class="text-xs px-2 py-0.5 rounded-full border"
            style="border-color: var(--border); color: var(--muted);"
          >
            {{ v.color }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
