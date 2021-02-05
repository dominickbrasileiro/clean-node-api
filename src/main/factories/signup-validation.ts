import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations = ['name', 'email', 'password', 'confirm_password'].map(
    field => {
      return new RequiredFieldValidation(field);
    },
  );

  return new ValidationComposite(validations);
};
