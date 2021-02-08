import request from 'supertest';
import { app } from '../config/app';
import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper';

describe('Login Routes', async () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    it('should return 200 on signup', async () => {
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
});
