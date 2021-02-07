import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token';
  },
}));

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret');
};

describe('JWT Adapter', () => {
  it('should call sign with correct values', async () => {
    const sut = makeSut();

    const signSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_id');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });

  it('should return a token on sign success', async () => {
    const sut = makeSut();

    const accessToken = await sut.encrypt('any_id');

    expect(accessToken).toBe('any_token');
  });

  it('should throw if sign throws', async () => {
    const sut = makeSut();

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.encrypt('any_id')).rejects.toThrow();
  });
});
