import {
  CompareFieldValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [
    'name',
    'email',
    'password',
    'confirm_password',
  ].map(field => {
    return new RequiredFieldValidation(field);
  });

  validations.push(new CompareFieldValidation('password', 'confirm_password'));

  const emailValidatorAdapter = new EmailValidatorAdapter();
  validations.push(new EmailValidation('email', emailValidatorAdapter));

  return new ValidationComposite(validations);
};
