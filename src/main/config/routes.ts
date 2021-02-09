import { Express, Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';

export function setupRoutes(app: Express): void {
  const router = Router();

  app.use('/api', router);

  const routesPath = path.join(__dirname, '..', 'routes');

  readdirSync(routesPath).map(async file => {
    if (!file.includes('.test.')) {
      const filePath = path.join(routesPath, file);

      const loadRoute = (await import(filePath)).default;

      loadRoute(router);
    }
  });
}
