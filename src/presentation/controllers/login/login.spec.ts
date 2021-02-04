import { Authentication } from '../../../domain/usecases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import {
  badRequest,
  serverError,
  unauthorized,
} from '../../helpers/http-helper';
import { EmailValidator, HttpRequest } from '../signup/signup-protocols';
import { LoginController } from './login';

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@example.com',
    password: 'any_password',
  },
});

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(): Promise<string> {
      return 'any_token';
    }
  }

  return new AuthenticationStub();
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};
interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();

  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return { sut, emailValidatorStub, authenticationStub };
};

describe('Login Controller', () => {
  it('should return 400 if no e-mail is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@example.com',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should return 400 if an invalid e-mail is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call EmailValidator with provided e-mail', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = makeFakeHttpRequest();

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any_email@example.com');
  });

  it('should call Authentication with provided values', async () => {
    const { sut, authenticationStub } = makeSut();

    const isValidSpy = jest.spyOn(authenticationStub, 'auth');

    const httpRequest = makeFakeHttpRequest();

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(
      'any_email@example.com',
      'any_password',
    );
  });

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null);

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unauthorized());
  });
});
