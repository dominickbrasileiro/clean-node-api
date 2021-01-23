import request from 'supertest';
import { app } from '../config/app';

describe('Content-Type Middleware', async () => {
  it('should return default content-type as json', async () => {
    app.get('/test_content_type_json', (req, res) => {
      res.send();
    });

    await request(app)
      .get('/test_content_type_json')
      .expect('Content-Type', /json/);
  });

  it('should return xml content-type if forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml');
      res.send();
    });

    await request(app)
      .get('/test_content_type_xml')
      .expect('Content-Type', /xml/);
  });
});
