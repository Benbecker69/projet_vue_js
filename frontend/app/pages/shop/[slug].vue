<script setup lang="ts">
definePageMeta({ layout: 'shop' });

const route = useRoute();
const config = useRuntimeConfig();
const cartStore = useCartStore();

const { data, error } = await useFetch<{ product: any }>(`${config.public.apiBase}/products/${route.params.slug}`);
const product = computed(() => data.value?.product);

if (error.value || !product.value) {
  throw createError({ statusCode: 404, message: 'Produit introuvable' });
}

useSeoMeta({
  title: computed(() => `${product.value?.name} — Smart Identity`),
  description: computed(() => product.value?.description),
});

const selectedVariant = ref(product.value?.variants[0] ?? null);
const qty = ref(1);
const added = ref(false);
const currentImage = ref(0);

function addToCart() {
  if (!selectedVariant.value || !product.value) return;
  cartStore.add({
    productId: product.value._id,
    variantSku: selectedVariant.value.sku,
    name: product.value.name,
    variantColor: selectedVariant.value.color,
    price: product.value.price,
    qty: qty.value,
    image: product.value.images[0] ?? '',
  });
  added.value = true;
  setTimeout(() => added.value = false, 2000);
}
</script>

<template>
  <div v-if="product" class="py-16 section-container">
    <NuxtLink to="/shop" class="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style="color: var(--muted);" :hover="{ color: 'white' }">
      ← Retour au catalogue
    </NuxtLink>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Images -->
      <div>
        <div class="overflow-hidden rounded-2xl mb-3" style="background-color: var(--surface);">
          <img :src="product.images[currentImage]" :alt="product.name" class="w-full aspect-square object-cover" />
        </div>
        <div v-if="product.images.length > 1" class="flex gap-2">
          <button
            v-for="(img, i) in product.images"
            :key="i"
            @click="currentImage = i"
            class="w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors"
            :style="currentImage === i ? 'border-color: var(--accent)' : 'border-color: transparent'"
          >
            <img :src="img" :alt="`Vue ${i+1}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Info -->
      <div>
        <h1 class="text-4xl font-display font-bold mb-2">{{ product.name }}</h1>
        <p class="text-3xl font-bold gradient-text mb-6">{{ product.price }} €</p>
        <p class="leading-relaxed mb-8" style="color: var(--muted);">{{ product.description }}</p>

        <!-- Variants -->
        <div class="mb-6">
          <p class="text-sm font-medium mb-3">Coloris / Version</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="v in product.variants"
              :key="v.sku"
              @click="selectedVariant = v"
              class="px-4 py-2 rounded-xl text-sm border-2 transition-all"
              :style="selectedVariant?.sku === v.sku
                ? 'border-color: var(--accent); color: var(--accent); background: rgba(124,92,255,0.1)'
                : 'border-color: var(--border); color: var(--muted)'"
            >
              {{ v.color }}
            </button>
          </div>
        </div>

        <!-- Quantity -->
        <div class="mb-8">
          <p class="text-sm font-medium mb-3">Quantité</p>
          <div class="inline-flex items-center gap-3 rounded-xl border px-4 py-2" style="border-color: var(--border);">
            <button @click="qty = Math.max(1, qty - 1)" class="text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10">−</button>
            <span class="font-semibold w-6 text-center">{{ qty }}</span>
            <button @click="qty = Math.min(10, qty + 1)" class="text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10">+</button>
          </div>
        </div>

        <button @click="addToCart" class="btn-primary w-full py-4 text-base">
          {{ added ? '✓ Ajouté au panier !' : 'Ajouter au panier' }}
        </button>

        <NuxtLink v-if="added" to="/cart" class="btn-secondary w-full py-4 text-base mt-3 text-center block">
          Voir le panier →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
