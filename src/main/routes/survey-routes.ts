import { Router } from 'express';
import { adaptRoute } from '../adapters/express/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory';

export default (router: Router) => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()));
};
