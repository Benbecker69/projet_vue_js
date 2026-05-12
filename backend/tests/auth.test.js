const request = require('supertest');
const app = require('../src/app');

describe('Auth', () => {
  it('POST /api/auth/register — crée un utilisateur et retourne un token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('POST /api/auth/register — refuse un email déjà pris', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'User 1',
      email: 'dup@example.com',
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/register').send({
      name: 'User 2',
      email: 'dup@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_TAKEN');
  });

  it('POST /api/auth/register — refuse un mot de passe trop court', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'short@example.com',
      password: '123',
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/auth/login — authentifie un utilisateur', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/login — refuse un mauvais mot de passe', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Bad Pass User',
      email: 'badpass@example.com',
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'badpass@example.com',
      password: 'wrongpass',
    });
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/login — refuse un utilisateur inexistant', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('GET /api/auth/me — 401 sans token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me — retourne l\'utilisateur avec un token valide', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Me User',
      email: 'me@example.com',
      password: 'password123',
    });
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${reg.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('me@example.com');
  });
});
