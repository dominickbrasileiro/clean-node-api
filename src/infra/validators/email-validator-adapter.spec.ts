import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const sut = makeSut();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = sut.isValid('invalid_email');

    expect(isValid).toBe(false);
  });

  it('should return true if validator returns true', () => {
    const sut = makeSut();

    const isValid = sut.isValid('valid_email@example.com');

    expect(isValid).toBe(true);
  });

  it('should call validator with provided e-mail', () => {
    const sut = makeSut();

    const isEmailSpy = jest.spyOn(validator, 'isEmail');

    sut.isValid('any_email@example.com');

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@example.com');
  });
});
