import env from '../../../config/env';
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication';
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../../infra/database/mongodb/account/account-mongo-repository';
import { Authentication } from '../../../../domain/usecases/authentication';

export const makeDbAuthentication = (): Authentication => {
  const bcryptAdapter = new BcryptAdapter(12);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);

  const accountRepository = new AccountMongoRepository();

  return new DbAuthentication(
    accountRepository,
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
  );
};
