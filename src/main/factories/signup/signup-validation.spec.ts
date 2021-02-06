import {
  CompareFieldValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidator } from '../../../presentation/protocols/email-validator';
import { makeSignUpValidation } from './signup-validation';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const validations: Validation[] = [
      'name',
      'email',
      'password',
      'confirm_password',
    ].map(field => {
      return new RequiredFieldValidation(field);
    });

    validations.push(
      new CompareFieldValidation('password', 'confirm_password'),
    );

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
