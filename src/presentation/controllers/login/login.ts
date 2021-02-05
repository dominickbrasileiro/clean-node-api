/* eslint-disable no-restricted-syntax */
import {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './login-protocols';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http-helper';

export class LoginController implements Controller {
  private readonly authentication: Authentication;

  private readonly validation: Validation;

  constructor(authentication: Authentication, validation: Validation) {
    this.authentication = authentication;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const err = this.validation.validate(httpRequest.body);

      if (err) {
        return badRequest(err);
      }

      const { email, password } = httpRequest.body;

      const accessToken = await this.authentication.auth(email, password);

      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
