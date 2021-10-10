import { sectionFromPath } from '../../helpers/section-from-path';

describe('Section from path', () => {
  test('Should correctly extract section from any given path', () => {
    expect(sectionFromPath('/')).toEqual('/');
    expect(sectionFromPath('/report')).toEqual('/report');
    expect(sectionFromPath('/api/users')).toEqual('/api');
  });
});
