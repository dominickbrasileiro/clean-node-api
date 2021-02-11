import {
  CompareFieldValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../../validation/validators';
import { Validation } from '../../../../presentation/protocols';
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter';

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
