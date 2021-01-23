/* eslint-disable no-console */
import { MongoHelper } from '../infra/database/mongodb/helpers/mongo-helper';
import env from './config/env';

(async () => {
  await MongoHelper.connect(env.mongoUrl);

  const { app } = await import('./config/app');

  app.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}`);
  });
})();
