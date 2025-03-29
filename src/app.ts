import express, { Application, Request, Response } from 'express';
import dotenvFLow from 'dotenv-flow';
import routes from './routes';

//dotenvFLow.config();

// Create the Express Application
const app: Application = express();

app.use('/api', routes);

export function startServer() {
    app.listen(4000, function() {
        console.log("Server is up and running on port: " + 4000);
    });
}
