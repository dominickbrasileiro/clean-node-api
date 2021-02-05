import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field');

    const error = sut.validate({});

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return null if validation succeeds', () => {
    const sut = new RequiredFieldValidation('field');

    const response = sut.validate({ field: 'any_value' });

    expect(response).toBeFalsy();
  });
});
