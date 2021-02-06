import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash() {
    return 'hashed_value';
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const sut = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a hash on success', async () => {
    const sut = makeSut();

    const hash = await sut.hash('any_value');

    expect(hash).toBe('hashed_value');
  });

  it('should throw if bcrypt throws', async () => {
    const sut = makeSut();

    jest
      .spyOn(bcrypt, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    await expect(sut.hash('any_value')).rejects.toThrow();
  });
});
