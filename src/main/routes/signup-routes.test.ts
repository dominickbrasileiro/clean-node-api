import request from 'supertest';
import { app } from '../config/app';

describe('Signup Routes', async () => {
  it('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email@example.com',
        password: 'any_password',
        confirm_password: 'any_password',
      })
      .expect(200);
  });
});
