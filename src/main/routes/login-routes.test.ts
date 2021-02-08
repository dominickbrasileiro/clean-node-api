import request from 'supertest';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import { app } from '../config/app';
import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper';

let accountCollection: Collection;

describe('Login Routes', async () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');

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

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      accountCollection = await MongoHelper.getCollection('accounts');

      const password = await hash('123456', 12);

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@example.com',
        password,
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@example.com',
          password: '123456',
        })
        .expect(200);
    });

    it('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@example.com',
          password: '123456',
        })
        .expect(401);
    });
  });
});
