import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols';
import { DbAddSurvey } from './db-add-survey';

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
});

const makeAddSurveyRepository = () => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(): Promise<void> {
      return null;
    }
  }

  return new AddSurveyRepositoryStub();
};

interface SutTypes {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return { sut, addSurveyRepositoryStub };
};

describe('DbAddSurvey Usecase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');

    const surveyData = makeFakeSurveyData();

    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockImplementationOnce(async () => {
        throw new Error();
      });

    await expect(sut.add(makeFakeSurveyData())).rejects.toThrow();
  });
});
