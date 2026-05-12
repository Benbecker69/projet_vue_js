const request = require('supertest');
const app = require('../src/app');

describe('Gestion des erreurs & routes', () => {
  it('GET /api/route-inconnue — retourne 404 avec format standard', async () => {
    const res = await request(app).get('/api/route-inconnue');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.message).toBeDefined();
  });

  it('POST /api/auth/register — 400 si email manquant', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toBeDefined();
  });

  it('POST /api/auth/register — 400 si nom manquant', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/auth/register — 400 si email invalide', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'pas-un-email',
      password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/me/profile — 401 sans token', async () => {
    const res = await request(app).get('/api/me/profile');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/me/nfc — 401 sans token', async () => {
    const res = await request(app).get('/api/me/nfc');
    expect(res.status).toBe(401);
  });

  it('POST /api/orders — 401 sans token', async () => {
    const res = await request(app).post('/api/orders').send({ items: [], shippingAddress: {} });
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me — 401 avec token malformé', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token_totalement_invalide');
    expect(res.status).toBe(401);
  });

  it('GET /api/products/slug-inconnu — 404 avec code PRODUCT_NOT_FOUND', async () => {
    const res = await request(app).get('/api/products/ce-produit-nexiste-pas');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('PRODUCT_NOT_FOUND');
  });

  it('GET /api/public/profile/slug-inconnu — 404', async () => {
    const res = await request(app).get('/api/public/profile/profil-inexistant-xyz');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('PROFILE_NOT_FOUND');
  });

  it('GET /api/marketing/type-invalide — 400', async () => {
    const res = await request(app).get('/api/marketing/type-qui-nexiste-pas');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_TYPE');
  });

  it('PATCH /api/me/profile — 400 si champ non autorisé (strict mode)', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Strict User',
      email: 'strict@example.com',
      password: 'password123',
    });
    const res = await request(app)
      .patch('/api/me/profile')
      .set('Authorization', `Bearer ${reg.body.token}`)
      .send({ champsInconnu: 'valeur' });
    expect(res.status).toBe(400);
  });
});
