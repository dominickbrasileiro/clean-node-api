import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async log(_: string): Promise<void> {}
  }

  return new LogErrorRepositoryStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          ok: true,
        },
      };

      return httpResponse;
    }
  }

  return new ControllerStub();
};

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();

  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );

  return { sut, controllerStub, logErrorRepositoryStub };
};

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@example.com',
        name: 'any_name',
        password: 'any_password',
        confirm_password: 'any_password',
      },
    };

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@example.com',
        name: 'any_name',
        password: 'any_password',
        confirm_password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        ok: true,
      },
    });
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const error = new Error();

    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => {
      return serverError(error);
    });

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@example.com',
        name: 'any_name',
        password: 'any_password',
        confirm_password: 'any_password',
      },
    };

    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenLastCalledWith(error.stack);
  });
});
