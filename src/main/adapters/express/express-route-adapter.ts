import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../../presentation/protocols';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };

    const httpResponse = await controller.handle(httpRequest);

    const { statusCode, body } = httpResponse;

    if (body.message) {
      return res.status(statusCode).json({
        message: body.message,
      });
    }

    return res.status(statusCode).json(body);
  };
};
