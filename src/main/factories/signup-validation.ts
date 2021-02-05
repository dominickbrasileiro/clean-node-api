import { CompareFieldValidation } from '../../presentation/helpers/validators/compare-field-validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

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

  return new ValidationComposite(validations);
};
