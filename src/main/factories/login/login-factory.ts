import env from '../../config/env';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../infra/database/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/database/mongodb/log/log-mongo-repository';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeLoginValidation } from './login-validation-factory';

export const makeLoginController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(12);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);

  const accountRepository = new AccountMongoRepository();
  const logMongoRepository = new LogMongoRepository();

  const dbAuthentication = new DbAuthentication(
    accountRepository,
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
  );

  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation(),
  );

  return new LogControllerDecorator(loginController, logMongoRepository);
};
