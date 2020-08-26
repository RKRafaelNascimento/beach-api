import './utils/module-alias';
import { Server as OvernightServer } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/Forecast';
import { Application } from 'express';
import * as database from '@src/utils/database';
import { BeachesController } from './controllers/beaches';
import { UserController } from './controllers/Users';

export class Server extends OvernightServer {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UserController();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public async start(): Promise<void> {
    this.app.listen(this.port, () => {
      console.log(`Server listening of port: ${this.port}`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}
