import { InvalidParamError } from '../../errors';
import { CompareFieldValidation } from './compare-field-validation';

const makeSut = (): CompareFieldValidation => {
  return new CompareFieldValidation('field', 'fieldToCompare');
};

describe('CompareField Validation', () => {
  it('should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({
      field: 'value',
      fieldToCompare: 'different_value',
    });

    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  it('should not return if validation succeeds', () => {
    const sut = makeSut();

    const response = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    });

    expect(response).toBeFalsy();
  });
});
