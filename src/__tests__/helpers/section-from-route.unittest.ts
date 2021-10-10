import { getSectionFromRoute } from '../../helpers/get-section-from-route';

describe('Section from route', () => {
  test('Should correctly extract section from any given route', () => {
    expect(getSectionFromRoute('/')).toEqual('/');
    expect(getSectionFromRoute('/report')).toEqual('/report');
    expect(getSectionFromRoute('/api/users')).toEqual('/api');
  });
});
