/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
} from '../protocols';
import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'confirm_password'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const { email, password, confirm_password } = httpRequest.body;

    if (password !== confirm_password) {
      return badRequest(new InvalidParamError('confirm_password'));
    }

    try {
      const isEmailValid = this.emailValidator.isValid(email);

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch {
      return serverError();
    }
  }
}
