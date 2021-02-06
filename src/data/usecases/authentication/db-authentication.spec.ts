import { AccountModel } from '../../../domain/models/account';
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct e-mail', async () => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository {
      async loadAccountByEmail(): Promise<AccountModel> {
        return {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@example.com',
          password: 'any_password',
        };
      }
    }

    const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepository);

    const loadSpy = jest.spyOn(
      loadAccountByEmailRepository,
      'loadAccountByEmail',
    );

    await sut.auth({
      email: 'any_email@example.com',
      password: 'any_password',
    });

    expect(loadSpy).toHaveBeenCalledWith('any_email@example.com');
  });
});
