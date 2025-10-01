import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'iBoard API',
      version: '1.0.0',
      description: 'A collaborative idea board API built with Express.js and Supabase',
      contact: {
        name: 'Pacifique Murangwa',
        email: 'contact@example.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://iboard.onrender.com/api'
          : 'http://localhost:3001/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      schemas: {
        Idea: {
          type: 'object',
          required: ['id', 'text', 'upvotes', 'downvotes', 'created_at', 'updated_at'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the idea',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            text: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'The idea content',
              example: 'Build a real-time collaborative whiteboard app',
            },
            upvotes: {
              type: 'integer',
              minimum: 0,
              description: 'Number of upvotes',
              example: 5,
            },
            downvotes: {
              type: 'integer',
              minimum: 0,
              description: 'Number of downvotes',
              example: 1,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'When the idea was created',
              example: '2024-01-01T12:00:00Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'When the idea was last updated',
              example: '2024-01-01T12:30:00Z',
            },
          },
        },
        CreateIdeaRequest: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'The idea content',
              example: 'Build a real-time collaborative whiteboard app',
            },
          },
        },
        VoteRequest: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the idea to vote on',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
              example: true,
            },
            data: {
              description: 'The response data',
            },
            count: {
              type: 'integer',
              description: 'Number of items (for list responses)',
              example: 10,
            },
            error: {
              type: 'string',
              description: 'Error message (if success is false)',
              example: 'Validation failed',
            },
            details: {
              type: 'string',
              description: 'Additional error details',
              example: 'Text field is required',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Bad Request',
            },
            details: {
              type: 'string',
              example: 'Invalid input provided',
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T12:00:00Z',
            },
            uptime: {
              type: 'number',
              example: 3600.5,
            },
            environment: {
              type: 'string',
              example: 'development',
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        TooManyRequests: {
          description: 'Too many requests',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Ideas',
        description: 'Operations related to ideas',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API files
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI setup
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'iBoard API Documentation',
  }));

  // JSON endpoint for the OpenAPI spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export default specs;
