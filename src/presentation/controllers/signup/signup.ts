/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  AddAccount,
} from './signup-protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http-helper';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'email', 'password', 'confirm_password'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const { name, email, password, confirm_password } = httpRequest.body;

    if (password !== confirm_password) {
      return badRequest(new InvalidParamError('confirm_password'));
    }

    try {
      const isEmailValid = this.emailValidator.isValid(email);

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({
        email,
        name,
        password,
      });

      return ok(account);
    } catch {
      return serverError();
    }
  }
}
