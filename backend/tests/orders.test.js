const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/Product');

let token;
let productId;
let variantSku;

beforeEach(async () => {
  const reg = await request(app).post('/api/auth/register').send({
    name: 'Order User',
    email: 'orders@example.com',
    password: 'password123',
  });
  token = reg.body.token;

  const product = await Product.create({
    name: 'Test Bracelet',
    slug: 'test-bracelet-order',
    description: 'Pour les tests commande',
    price: 29.99,
    variants: [{ color: 'Noir', sku: 'TB-BLK-ORD' }],
  });
  productId = product._id.toString();
  variantSku = 'TB-BLK-ORD';
});

describe('Orders', () => {
  it('POST /api/orders — 401 sans authentification', async () => {
    const res = await request(app).post('/api/orders').send({
      items: [{ productId, variantSku, qty: 1 }],
      shippingAddress: { fullName: 'Test', line1: '1 rue test', city: 'Paris', postalCode: '75001' },
    });
    expect(res.status).toBe(401);
  });

  it('POST /api/orders — crée une commande avec recalcul du prix serveur', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId, variantSku, qty: 2 }],
        shippingAddress: { fullName: 'Jean Test', line1: '12 rue de la Paix', city: 'Paris', postalCode: '75001' },
      });

    expect(res.status).toBe(201);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.total).toBe(59.98);
    expect(res.body.order.items[0].qty).toBe(2);
    expect(res.body.order.items[0].unitPrice).toBe(29.99);
  });

  it('POST /api/orders — 400 si panier vide', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [],
        shippingAddress: { fullName: 'Jean Test', line1: '1 rue', city: 'Paris', postalCode: '75001' },
      });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/orders — 400 si produit introuvable', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: '000000000000000000000000', variantSku: 'FAKE', qty: 1 }],
        shippingAddress: { fullName: 'Jean Test', line1: '1 rue', city: 'Paris', postalCode: '75001' },
      });
    expect(res.status).toBe(400);
  });

  it('POST /api/orders — 400 si adresse incomplète', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId, variantSku, qty: 1 }],
        shippingAddress: { fullName: 'Jean Test' },
      });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/me/orders — 401 sans authentification', async () => {
    const res = await request(app).get('/api/me/orders');
    expect(res.status).toBe(401);
  });

  it('GET /api/me/orders — retourne les commandes de l\'utilisateur connecté', async () => {
    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId, variantSku, qty: 1 }],
        shippingAddress: { fullName: 'Jean Test', line1: '1 rue', city: 'Paris', postalCode: '75001' },
      });

    const res = await request(app)
      .get('/api/me/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.orders)).toBe(true);
    expect(res.body.orders.length).toBe(1);
  });

  it('GET /api/me/orders — ne retourne pas les commandes d\'un autre utilisateur', async () => {
    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId, variantSku, qty: 1 }],
        shippingAddress: { fullName: 'Jean Test', line1: '1 rue', city: 'Paris', postalCode: '75001' },
      });

    const otherReg = await request(app).post('/api/auth/register').send({
      name: 'Other User',
      email: 'other@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .get('/api/me/orders')
      .set('Authorization', `Bearer ${otherReg.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.orders.length).toBe(0);
  });
});
