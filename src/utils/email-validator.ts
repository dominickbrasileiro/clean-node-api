import { EmailValidator } from '../presentation/protocols/email-validator';

export class EmailValidatorAdapter implements EmailValidator {
  isValid(_: string): boolean {
    return false;
  }
}
