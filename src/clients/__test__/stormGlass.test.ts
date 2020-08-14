import { StormGlass } from '@src/clients/StormGlass';
import axios from 'axios';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import * as HTTPUtils from '@src/utils/request';

jest.mock('@src/utils/request');

describe('StormGlass client', () => {
  const MockedRequestClass = HTTPUtils.Request as jest.Mocked<
    typeof HTTPUtils.Request
  >;
  const mockedRequest = new HTTPUtils.Request() as jest.Mocked<
    HTTPUtils.Request
  >;
  it('should return the normalized forecast from the StormClass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeather3HoursFixture,
    } as HTTPUtils.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });
  it('should exclude incomplete data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00+00:00',
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtils.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });
  it('should get a generic error from stormGlass service when then request fail before reaching the service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue({ message: 'Network error' });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network'
    );
  }),
    it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
      const lat = -33.792726;
      const lng = 151.289824;

      MockedRequestClass.isRequestError.mockReturnValue(true);
      mockedRequest.get.mockRejectedValue({
        response: {
          status: 429,
          data: { errors: ['Rate limit reached'] },
        },
      });

      const stormGlass = new StormGlass(mockedRequest);

      await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
        'Unexpected error returned by the stormGlass service: Error: {"errors":["Rate limit reached"]} Code: 429'
      );
    });
});
