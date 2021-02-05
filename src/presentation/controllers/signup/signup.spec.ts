import { SignUpController } from './signup';
import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from '../../errors';
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel,
  HttpRequest,
  Validation,
} from './signup-protocols';
import { badRequest, serverError, ok } from '../../helpers/http-helper';

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@example.com',
  password: 'valid_password',
});

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@example.com',
    password: 'any_password',
    confirm_password: 'any_password',
  },
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(_: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();

      return fakeAccount;
    }
  }

  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(): Error {
      return null;
    }
  }

  return new ValidationStub();
};
interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();

  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub,
  );

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
  };
};

describe('SignUp Controller', () => {
  it('should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@example.com',
        password: 'any_password',
        confirm_password: 'invalid_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('confirm_password')),
    );
  });

  it('should return 400 if an invalid e-mail is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should call EmailValidator with provided e-mail', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = makeFakeHttpRequest();

    await sut.handle(httpRequest);
    expect(isValidSpy).toBeCalledWith('any_email@example.com');
  });

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const error = new Error();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw error;
    });

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)));
  });

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();

    const error = new Error();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      throw error;
    });

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)));
  });

  it('should call AddAccount with provided values', async () => {
    const { sut, addAccountStub } = makeSut();

    const isValidSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = makeFakeHttpRequest();

    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@example.com',
      password: 'any_password',
    });
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  it('should call Validation with provided values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeHttpRequest();

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });
});
