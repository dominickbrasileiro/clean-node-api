/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Authentication,
} from './signup-protocols-controller';
import { badRequest, ok, serverError } from '../../helpers/http/http-helper';
import { Validation } from '../../protocols/validation';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

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

      await this.authentication.auth({ email, password });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
