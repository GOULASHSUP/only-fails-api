import express, { Application, Request, Response } from 'express';
import dotenvFLow from 'dotenv-flow';
import { testConnection } from './repository/database';

import routes from './routes';

dotenvFLow.config();

// Create the Express Application
const app: Application = express();

export function startServer() {

    app.use(express.json());

    // Bind routes to the application
    app.use('/api', routes);

    // Test the connection to the database
    testConnection();
    
    const PORT: number = parseInt(process.env.PORT as string) || 4000;
    app.listen(PORT, function() {
        console.log("Server is up and running on port: " + PORT);
    });
}
