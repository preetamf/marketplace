# Marketplace API

A RESTful API service for a marketplace application, built with Node.js, Express, and MongoDB.

## Features

- RESTful API endpoints for marketplace data
- MongoDB database integration
- Rate limiting and security middleware
- Comprehensive error handling
- Logging with Winston
- Environment-based configuration
- Health check endpoint

## Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 4.4
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd marketplace
```

2. Install dependencies:
```bash
npm install
```
`
3. Create a `.env` file:
```bash
cp .env.sample .env
```

4. Update the `.env` file with your configuration.

## Development

Start the development server:
```bash
npm run dev
```

## Production

Start the production server:
```bash
npm start
```

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/categories/featured` - Get featured categories
- `GET /api/products/trending` - Get trending products
- `GET /api/products/best-selling` - Get best-selling products
- `GET /api/banners` - Get homepage banners

## Project Structure

```
marketplace/
├── src/                         # Main application source code
│   ├── config/                  # Configuration settings
│   ├── models/                  # Mongoose schemas and models
│   ├── controllers/             # Route logic handlers
│   ├── services/                # Business logic layer
│   ├── routes/                  # Express route definitions
│   ├── middleware/              # Express middlewares
│   ├── validators/              # Zod schemas for validation
│   ├── utils/                   # Utilities and helpers
│   ├── app.js                   # Initialize app, middleware, routes
│   └── server.js                # Entry point - starts server
├── tests/                       # Jest test files
├── .env                         # Environment variables
├── .env.sample                  # Sample env file
├── .gitignore
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 