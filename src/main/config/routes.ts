import { Express, Router } from 'express';
import fg from 'fast-glob';

export function setupRoutes(app: Express): void {
  const router = Router();

  app.use('/api', router);

  fg.sync('**/src/main/routes/**routes.ts').map(async file => {
    const loadRoute = (await import(`../../../${file}`)).default;

    loadRoute(router);
  });
}
