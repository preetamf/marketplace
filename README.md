# Marketplace API

A robust e-commerce API built with Node.js, Express, and MongoDB. This API provides endpoints for managing products, categories, and banners in a marketplace application.

## Features

- 🛍️ Product Management
- 📦 Category Management
- 🎯 Banner Management
- 🔍 Advanced Search & Filtering
- 📊 Pagination
- 🔒 Rate Limiting
- ✅ Input Validation
- 📝 Logging
- 🐳 Docker Support
- 🚀 Deployment Ready
- 🏥 Health Checks
- 🔄 Auto-Restart
- 📈 Monitoring Ready

## Prerequisites

- Node.js (v20 or higher)
- MongoDB (v6 or higher)
- npm or yarn
- Docker (optional)
- Docker Compose (optional)

## Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/marketplace.git
cd marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development
API_VERSION=v1
API_PREFIX=/api

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/marketplace
MONGODB_USERNAME=
MONGODB_PASSWORD=

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

4. Start MongoDB:
```bash
# On macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# On Ubuntu/Debian
sudo service mongod start
```

5. Run the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Docker Development

1. Build and start the containers:
```bash
docker-compose up
```

2. Access the API:
```
http://localhost:3000/api/v1/health
```

### Docker Production

1. Build and start the production containers:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

2. Check the logs:
```bash
docker-compose logs -f
```

3. Monitor the health:
```bash
curl http://localhost:3000/api/v1/health
```

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "success",
  "message": "API is healthy",
  "timestamp": "2024-03-21T12:00:00.000Z",
  "uptime": 1234.56,
  "database": "connected",
  "version": "1.0.0",
  "environment": "production"
}
```

### Endpoints

#### Categories

- `GET /categories` - Get all categories
- `GET /categories/featured` - Get featured categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create a new category
- `PUT /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

#### Products

- `GET /products` - Get all products with pagination
- `GET /products/trending` - Get trending products
- `GET /products/best-selling` - Get best-selling products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create a new product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

#### Banners

- `GET /banners` - Get all active banners
- `GET /banners/:id` - Get banner by ID
- `POST /banners` - Create a new banner
- `PUT /banners/:id` - Update a banner
- `DELETE /banners/:id` - Delete a banner

### Query Parameters

#### Products

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field (e.g., price, rating)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `rating` - Minimum rating
- `tags` - Product tags
- `category` - Category ID
- `search` - Search term

### Response Format

```json
{
  "status": "success",
  "pagination": {
    "total": 100,
    "totalPages": 10,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  },
  "data": {
    // Response data
  }
}
```

## Deployment

### Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following environment variables:
   - `MONGODB_URI`
   - `NODE_ENV=production`
   - `PORT=3000`
4. Deploy!

### Docker

1. Build and push the Docker image:
```bash
docker build -t yourusername/marketplace-api .
docker push yourusername/marketplace-api
```

2. Deploy to your preferred container platform (e.g., Kubernetes, AWS ECS)

## Development

### Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── utils/          # Utility functions
├── data/           # Seed data
├── app.js          # Express application
└── server.js       # Server entry point
```

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed the database with sample data
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Monitoring

The API includes built-in health checks and logging. For production monitoring:

1. Health Check Endpoint: `/api/v1/health`
2. Logs: Located in `logs/app.log`
3. Metrics: Available through the health check endpoint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or create an issue in the repository. 