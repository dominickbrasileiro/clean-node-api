import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/database/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/database/mongodb/log/log-mongo-repository';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeSignUpValidation } from './signup-validation-factory';

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