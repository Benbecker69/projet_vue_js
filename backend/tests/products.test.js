const request = require('supertest');
const Product = require('../src/models/Product');
const app = require('../src/app');

describe('Products', () => {
  beforeEach(async () => {
    await Product.create({
      name: 'Test Bracelet',
      slug: 'test-bracelet',
      description: 'Un bracelet de test',
      price: 29.99,
      variants: [{ color: 'Noir', sku: 'TB-BLK' }],
    });
  });

  it('GET /api/products — retourne la liste des produits', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it('GET /api/products/:slug — retourne un produit', async () => {
    const res = await request(app).get('/api/products/test-bracelet');
    expect(res.status).toBe(200);
    expect(res.body.product.slug).toBe('test-bracelet');
  });

  it('GET /api/products/:slug — 404 si slug inconnu', async () => {
    const res = await request(app).get('/api/products/inconnu');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('PRODUCT_NOT_FOUND');
  });
});
