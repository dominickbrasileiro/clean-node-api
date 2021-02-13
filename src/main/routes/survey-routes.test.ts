import request from 'supertest';
import { Collection } from 'mongodb';
import { app } from '../config/app';
import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper';

let surveyCollection: Collection;

describe('Login Routes', async () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');

    await surveyCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    it('should return 200 on signup', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [
            {
              answer: 'answer_1',
              image: 'https://image.com',
            },
            {
              answer: 'answer_2',
            },
          ],
        })
        .expect(204);
    });
  });
});
