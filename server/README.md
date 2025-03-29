# GTFS Backend Server

A NestJS-based backend server for serving GTFS (General Transit Feed Specification) data. This server provides a RESTful API to access and query GTFS static data.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd gtfs-backend/server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the server directory with the configuration similar to `.env.example`

4. Start the development server:

```bash
npm run start:dev
```

The server will start on `http://localhost:3000` (or the port specified in your .env file).

## API Documentation

The API documentation is available through Swagger UI at:

```
http://localhost:3000/api
```

### Available Endpoints

#### Agencies

- `GET /agencies` - Get all agencies
- `GET /agencies/:id` - Get agency by ID

#### Stops

- `GET /stops` - Get all stops
- `GET /stops/:id` - Get stop by ID
- `GET /stops/nearby` - Find stops near a location
  - Query parameters:
    - `lat`: Latitude
    - `lon`: Longitude
    - `radius`: Search radius in meters (default: 1000)

#### Routes

- `GET /routes` - Get all routes
- `GET /routes/:id` - Get route by ID
- `GET /routes/:id/trips` - Get trips for a route

#### Trips

- `GET /trips` - Get all trips
- `GET /trips/:id` - Get trip by ID
- `GET /trips/:id/stop-times` - Get stop times for a trip

#### Stop Times

- `GET /stop-times` - Get all stop times
- `GET /stop-times/:id` - Get stop time by ID

#### Calendar

- `GET /calendar` - Get all calendar entries
- `GET /calendar/:id` - Get calendar entry by ID
- `GET /calendar/:id/dates` - Get calendar dates for a service

#### Calendar Dates

- `GET /calendar-dates` - Get all calendar dates
- `GET /calendar-dates/:id` - Get calendar date by ID

#### Shapes

- `GET /shapes` - Get all shapes
- `GET /shapes/:id` - Get shape by ID

## Development

### Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   ├── entities/         # Database entities
│   ├── filters/          # Exception filters
│   ├── interceptors/     # Request/response interceptors
│   ├── gtfs/            # GTFS module
│   │   ├── gtfs.controller.ts
│   │   ├── gtfs.service.ts
│   │   └── gtfs.module.ts
│   ├── app.module.ts
│   └── main.ts
├── test/                # Test files
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start the application in development mode with hot-reload
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage

### Error Handling

The application includes comprehensive error handling and logging:

- All API requests and responses are logged
- Errors are logged with stack traces
- Request duration is tracked
- Structured error responses are returned to clients

### Data Validation

The application uses class-transformer and class-validator for data validation:

- Automatic type conversion
- Input sanitization
- Property whitelisting
- Custom validation rules

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
