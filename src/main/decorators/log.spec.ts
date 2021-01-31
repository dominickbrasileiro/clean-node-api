import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { ok, serverError } from '../../presentation/helpers/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@example.com',
    password: 'any_password',
    confirm_password: 'any_password',
  },
});

const makeFakeSuccess = () => ({
  ok: true,
});

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async logError(_: string): Promise<void> {}
  }

  return new LogErrorRepositoryStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(): Promise<HttpResponse> {
      const httpResponse = ok(makeFakeSuccess());

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

    const httpRequest = makeFakeHttpRequest();

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok(makeFakeSuccess()));
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const error = new Error();

    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => {
      return serverError(error);
    });

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    const httpRequest = makeFakeHttpRequest();

    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenLastCalledWith(error.stack);
  });
});
