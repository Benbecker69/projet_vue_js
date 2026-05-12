import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../../app/stores/cart'

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const itemA = {
    productId: 'prod-001',
    variantSku: 'SBC-BLK',
    name: 'Smart Bracelet Classic',
    variantColor: 'Noir',
    price: 29.99,
    qty: 1,
    image: 'https://example.com/img.jpg',
  }

  const itemB = {
    productId: 'prod-002',
    variantSku: 'SBP-BLK',
    name: 'Smart Bracelet Pro',
    variantColor: 'Noir mat',
    price: 59.99,
    qty: 1,
    image: 'https://example.com/img2.jpg',
  }

  it('démarre avec un panier vide', () => {
    const cart = useCartStore()
    expect(cart.items).toHaveLength(0)
    expect(cart.total).toBe(0)
    expect(cart.count).toBe(0)
  })

  it('add() — ajoute un article au panier', () => {
    const cart = useCartStore()
    cart.add(itemA)
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].name).toBe('Smart Bracelet Classic')
  })

  it('add() — incrémente la quantité si même produit + même variante', () => {
    const cart = useCartStore()
    cart.add(itemA)
    cart.add({ ...itemA, qty: 2 })
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].qty).toBe(3)
  })

  it('add() — ajoute deux lignes si variantes différentes', () => {
    const cart = useCartStore()
    cart.add(itemA)
    cart.add({ ...itemA, variantSku: 'SBC-SLV', variantColor: 'Argent' })
    expect(cart.items).toHaveLength(2)
  })

  it('remove() — supprime un article du panier', () => {
    const cart = useCartStore()
    cart.add(itemA)
    cart.add(itemB)
    cart.remove(itemA.productId, itemA.variantSku)
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].productId).toBe('prod-002')
  })

  it('updateQty() — met à jour la quantité d\'un article', () => {
    const cart = useCartStore()
    cart.add(itemA)
    cart.updateQty(itemA.productId, itemA.variantSku, 5)
    expect(cart.items[0].qty).toBe(5)
  })

  it('updateQty() — supprime l\'article si quantité <= 0', () => {
    const cart = useCartStore()
    cart.add(itemA)
    cart.updateQty(itemA.productId, itemA.variantSku, 0)
    expect(cart.items).toHaveLength(0)
  })

  it('total — calcule la somme correctement', () => {
    const cart = useCartStore()
    cart.add({ ...itemA, qty: 2 })
    cart.add(itemB)
    expect(cart.total).toBeCloseTo(29.99 * 2 + 59.99, 2)
  })

  it('count — retourne le nombre total d\'articles', () => {
    const cart = useCartStore()
    cart.add({ ...itemA, qty: 3 })
    cart.add(itemB)
    expect(cart.count).toBe(4)
  })

  it('clear() — vide entièrement le panier', () => {
    const cart = useCartStore()
    cart.add(itemA)
    cart.add(itemB)
    cart.clear()
    expect(cart.items).toHaveLength(0)
    expect(cart.total).toBe(0)
  })

  it('persiste dans localStorage après add()', () => {
    const cart = useCartStore()
    cart.add(itemA)
    const saved = localStorage.getItem('si_cart')
    expect(saved).not.toBeNull()
    const parsed = JSON.parse(saved!)
    expect(parsed[0].productId).toBe('prod-001')
  })

  it('persiste dans localStorage après clear()', () => {
    const cart = useCartStore()
    cart.add(itemA)
    cart.clear()
    const saved = localStorage.getItem('si_cart')
    expect(JSON.parse(saved!)).toHaveLength(0)
  })
})
