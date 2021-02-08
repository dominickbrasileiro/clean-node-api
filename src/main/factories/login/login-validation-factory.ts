import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = ['email', 'password'].map(field => {
    return new RequiredFieldValidation(field);
  });

  const emailValidatorAdapter = new EmailValidatorAdapter();
  validations.push(new EmailValidation('email', emailValidatorAdapter));

  return new ValidationComposite(validations);
};
