/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import Controller from '../protocols/controller';
import { HttpRequest, HttpResponse } from '../protocols/http';
import MissingParamError from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import EmailValidator from '../protocols/email-validator';
import InvalidParamError from '../errors/invalid-param-error';

export default class SignUpController implements Controller {
  private emailValidator: EmailValidator;

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

    const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'));
    }
  }
}
