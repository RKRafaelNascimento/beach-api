import { StormGlass, IForecastPoint } from '@src/clients/StormGlass';
import { InternalError } from '@src/utils/errors/internal-error';
import { IBeach } from '@src/models/beach';
import logger from '@src/logger';
import { Rating } from './rating';

export interface ITimeForecast {
  time: string;
  forecast: IBeachForecast[];
}

export interface IBeachForecast extends Omit<IBeach, 'user'>, IForecastPoint {}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(
    protected stormGlass = new StormGlass(),
    protected RatingService: typeof Rating = Rating
  ) {}

  public async processForecastForBeaches(
    beaches: IBeach[]
  ): Promise<ITimeForecast[]> {
    const pointsWithCorrectSources: IBeachForecast[] = [];
    logger.info(`Preparing the forecast for ${beaches} beaches`);
    try {
      for (const beach of beaches) {
        const rating = new this.RatingService(beach);
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichedBeachData(points, beach, rating);
        pointsWithCorrectSources.push(...enrichedBeachData);
      }
      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (error) {
      logger.error(error);
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private enrichedBeachData(
    points: IForecastPoint[],
    beach: IBeach,
    rating: Rating
  ): IBeachForecast[] {
    return points.map((point) => ({
      ...{},
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRateForPoint(point),
      },
      ...point,
    }));
  }

  private mapForecastByTime(forecast: IBeachForecast[]): ITimeForecast[] {
    const forecastByTime: ITimeForecast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }
    return forecastByTime;
  }
}
