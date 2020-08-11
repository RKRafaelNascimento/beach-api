import './utils/module-alias'
import { Server as OvernightServer } from '@overnightjs/core'
import bodyParser from 'body-parser'
import { ForecastController } from './controllers/Forecast'
import { Application } from 'express'

export class Server extends OvernightServer{
    constructor(private port = 3000){
        super()
    }

    public init(): void {
        this.setupExpress()
        this.setupControllers()
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json())
    }

    private setupControllers(): void {
        const forecastController = new ForecastController()
        this.addControllers([forecastController])
    }

    public getApp(): Application {
        return this.app
    }

}