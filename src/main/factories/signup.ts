import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/database/mongodb/account-repository/account';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter();

  const encrypter = new BcryptAdapter(12);

  const accountMongoRepository = new AccountMongoRepository();

  const dbAddAccount = new DbAddAccount(encrypter, accountMongoRepository);

  return new SignUpController(emailValidatorAdapter, dbAddAccount);
};
