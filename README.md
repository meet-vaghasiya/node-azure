# NestJS Demo Application

A simple NestJS application with a home demo page.

## Description

This is a NestJS project featuring a beautiful, responsive home page that demonstrates the framework's capabilities.

## Installation

```bash
npm install
```

## Running the app

```bash
# development mode
npm run start

# watch mode (recommended for development)
npm run start:dev

# production mode
npm run start:prod
```

## Build

```bash
npm run build
```

## Access the Application

After starting the application, open your browser and navigate to:

```
http://localhost:3000
```

You will see a beautiful home demo page with NestJS branding.

## Project Structure

```
src/
  ├── app.controller.ts   # Main controller with home route
  ├── app.service.ts      # Service that provides the HTML demo page
  ├── app.module.ts       # Root module
  └── main.ts            # Application entry point
```

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Static typing for JavaScript
- **Express** - HTTP server framework
- **RxJS** - Reactive programming library

## License

ISC
