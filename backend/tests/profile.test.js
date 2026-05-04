const request = require('supertest');
const app = require('../src/app');

async function createAndLoginUser(suffix = '') {
  const reg = await request(app).post('/api/auth/register').send({
    name: `Profile User ${suffix}`,
    email: `profile${suffix}@example.com`,
    password: 'password123',
  });
  return reg.body.token;
}

describe('Profile', () => {
  it('GET /api/me/profile — 401 sans auth', async () => {
    const res = await request(app).get('/api/me/profile');
    expect(res.status).toBe(401);
  });

  it('PATCH /api/me/profile — met à jour la bio', async () => {
    const token = await createAndLoginUser('bio');
    const res = await request(app)
      .patch('/api/me/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: 'Ma nouvelle bio' });
    expect(res.status).toBe(200);
    expect(res.body.user.profile.bio).toBe('Ma nouvelle bio');
  });

  it('POST /api/me/links — ajoute un lien', async () => {
    const token = await createAndLoginUser('links');
    const res = await request(app)
      .post('/api/me/links')
      .set('Authorization', `Bearer ${token}`)
      .send({ label: 'Mon site', url: 'https://example.com', icon: 'globe' });
    expect(res.status).toBe(201);
    expect(res.body.links.length).toBe(1);
    expect(res.body.links[0].label).toBe('Mon site');
  });

  it('DELETE /api/me/links/:id — supprime un lien', async () => {
    const token = await createAndLoginUser('del');
    const add = await request(app)
      .post('/api/me/links')
      .set('Authorization', `Bearer ${token}`)
      .send({ label: 'À supprimer', url: 'https://example.com' });

    const linkId = add.body.links[0]._id;
    const del = await request(app)
      .delete(`/api/me/links/${linkId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);
    expect(del.body.links.length).toBe(0);
  });
});
