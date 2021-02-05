import { MissingParamError } from '../../errors';
import { Validation } from './validation';
import { ValidationComposite } from './validation-composite';

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];

  const sut = new ValidationComposite(validationStubs);

  return { sut, validationStubs };
};

describe('Validation Composite', () => {
  it('should should return an error if a validation fail', () => {
    const { sut, validationStubs } = makeSut();

    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('missing_field'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('missing_field'));
  });
});
