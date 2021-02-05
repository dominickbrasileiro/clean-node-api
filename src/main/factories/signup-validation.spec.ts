import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { makeSignUpValidation } from './signup-validation';

jest.mock('../../presentation/helpers/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const validations = ['name', 'email', 'password', 'confirm_password'].map(
      field => {
        return new RequiredFieldValidation(field);
      },
    );

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
