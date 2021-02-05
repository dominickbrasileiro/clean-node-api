/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
} from './signup-protocols';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import { Validation } from '../../helpers/validators/validation';

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount;

  private readonly validation: Validation;

  constructor(addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const err = this.validation.validate(httpRequest.body);

      if (err) {
        return badRequest(err);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({
        email,
        name,
        password,
      });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
