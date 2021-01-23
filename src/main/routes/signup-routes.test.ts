import request from 'supertest';
import { app } from '../config/app';
import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper';

describe('Signup Routes', async () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getColletion('accounts');

    await accountCollection.deleteMany({});
  });

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
