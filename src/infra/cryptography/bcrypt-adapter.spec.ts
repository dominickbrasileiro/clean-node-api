import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash() {
    return 'hashed_value';
  },
}));

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const salt = 12;

    const sut = new BcryptAdapter(salt);

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a hash on success', async () => {
    const salt = 12;

    const sut = new BcryptAdapter(salt);

    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hashed_value');
  });
});
