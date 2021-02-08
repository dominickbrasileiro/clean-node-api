import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route-adapter';
import { makeLoginController } from '../factories/login/login-factory';
import { makeSignUpController } from '../factories/signup/signup-factory';

export default (router: Router) => {
  router.post('/login', adaptRoute(makeLoginController()));
  router.post('/signup', adaptRoute(makeSignUpController()));
};
