import { MongoHelper as sut } from './mongo-helper';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  it('should reconnect if client is down', async () => {
    let accountColletion = await sut.getColletion('accounts');
    expect(accountColletion).toBeTruthy();

    await sut.disconnect();

    accountColletion = await sut.getColletion('accounts');
    expect(accountColletion).toBeTruthy();
  });
});
