import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Application } from 'express';

// Setup Swagger documentation
export function setupDocs(app: Application) {
    const swaggerDefinition = {
        openapi: '3.0.0',
        info: {
            title: 'ONLY-FAILS API',
            version: '1.0.0',
            description: 'MongoDB Express Node TypeScript REST API',
            },
            servers: [
            {
                url: 'http://localhost:4000/api/',
                description: 'Local development server',
            },
            ],
            components: {
            securitySchemes: {
                ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'auth-token',
                },
            },
            schemas: {
                // Product schema (FailedProduct in your case)
                FailedProduct: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' },
                        imageURL: { type: 'string' },
                        category: { type: 'string' },
                        startDate: { type: 'string', format: 'date' },
                        failureDate: { type: 'string', format: 'date' },
                        upvotes: { type: 'number' },
                        downvotes: { type: 'number' },
                        comments: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    userId: { type: 'string' },
                                    text: { type: 'string' },
                                    date: { type: 'string', format: 'date' },
                                },
                            },
                        },
                        _createdBy: { type: 'string' },
                    },
                },
                // User schema
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        role: { type: 'string', enum: ['admin', 'user'] },
                        registerDate: { type: 'string', format: 'date' },
                    },
                },
                // Login response schema
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        userId: { type: 'string' },
                        role: { type: 'string' },
                    },
                },
            },
        },
    };

    const options = {
        swaggerDefinition,
        apis: ['**/*.ts']
    };

    const swaggerSpec = swaggerJSDoc(options);

    // Serve Swagger UI
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}