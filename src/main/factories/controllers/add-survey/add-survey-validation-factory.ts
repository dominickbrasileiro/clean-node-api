import {
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../../validation/validators';
import { Validation } from '../../../../presentation/protocols';

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = ['question', 'answers'].map(field => {
    return new RequiredFieldValidation(field);
  });

  return new ValidationComposite(validations);
};
