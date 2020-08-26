import nock from 'nock';
import { Beach, BeachPosition } from '@src/models/beach';
import apiForecastResponse1BeachFixture from '../fixtures/api_forecast_response_1_beach.json';
import stormGlassWeather3HoursFixture from '../fixtures/stormglass_weather_3_hours.json';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
describe('Beach forecast functional tests', () => {
  let token: string;
  beforeAll(async () => {
    const defaultUser = {
      name: 'John Doe',
      email: 'john2@mail.com',
      password: '1234',
    };
    await Beach.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
      user: user.id,
    };
    token = AuthService.generatedToken(user.toJSON());
    const beach = new Beach(defaultBeach);
    await beach.save();
  });

  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
      })
      .reply(200, stormGlassWeather3HoursFixture);
    const { body, status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token });
    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse1BeachFixture);
  });
});
