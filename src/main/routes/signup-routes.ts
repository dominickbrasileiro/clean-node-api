import { Router } from 'express';

export default (router: Router) => {
  router.post('/signup', (req, res) => {
    return res.json({ ok: true });
  });
};
