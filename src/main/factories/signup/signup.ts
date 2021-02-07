import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/database/mongodb/account-repository/account';
import { LogMongoRepository } from '../../../infra/database/mongodb/log-repository/log';
import { SignUpController } from '../../../presentation/controllers/signup/signup';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controller => {
  const encrypter = new BcryptAdapter(12);

  const accountMongoRepository = new AccountMongoRepository();
  const logMongoRepository = new LogMongoRepository();

  const dbAddAccount = new DbAddAccount(encrypter, accountMongoRepository);

  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation(),
  );

  return new LogControllerDecorator(signUpController, logMongoRepository);
};
