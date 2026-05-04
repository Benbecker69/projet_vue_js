export interface CartItem {
  productId: string;
  variantSku: string;
  name: string;
  variantColor: string;
  price: number;
  qty: number;
  image: string;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  if (import.meta.client) {
    const saved = localStorage.getItem('si_cart');
    if (saved) {
      try { items.value = JSON.parse(saved); } catch {}
    }
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem('si_cart', JSON.stringify(items.value));
    }
  }

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty, 0)
  );

  function add(item: CartItem) {
    const existing = items.value.find(
      i => i.productId === item.productId && i.variantSku === item.variantSku
    );
    if (existing) {
      existing.qty += item.qty;
    } else {
      items.value.push({ ...item });
    }
    persist();
  }

  function remove(productId: string, variantSku: string) {
    items.value = items.value.filter(
      i => !(i.productId === productId && i.variantSku === variantSku)
    );
    persist();
  }

  function updateQty(productId: string, variantSku: string, qty: number) {
    const item = items.value.find(i => i.productId === productId && i.variantSku === variantSku);
    if (item) {
      if (qty <= 0) remove(productId, variantSku);
      else item.qty = qty;
      persist();
    }
  }

  function clear() {
    items.value = [];
    persist();
  }

  return { items, total, count, add, remove, updateQty, clear };
});
