import { SignUpController } from '../../../../presentation/controllers/login/signup/signup-controller';
import { Controller } from '../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';
import { makeDbAddAccount } from '../../usecases/authentication/db-add-account-factory';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeDbAuthentication(),
    makeSignUpValidation(),
  );

  return makeLogControllerDecorator(controller);
};
