import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHomePage(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NestJS Demo Home</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 60px 40px;
            text-align: center;
            max-width: 600px;
            width: 100%;
          }
          .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 40px;
            color: white;
            font-weight: bold;
          }
          h1 {
            color: #333;
            font-size: 36px;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-top: 40px;
          }
          .feature {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            transition: transform 0.3s ease;
          }
          .feature:hover {
            transform: translateY(-5px);
          }
          .feature-icon {
            font-size: 30px;
            margin-bottom: 10px;
          }
          .feature-title {
            color: #667eea;
            font-weight: bold;
            font-size: 16px;
          }
          .footer {
            margin-top: 40px;
            color: #999;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">N</div>
          <h1>Welcome to NestJS - Docker CICD - final test</h1>
          <p>Your progressive Node.js framework is up and running successfully.</p>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon">⚡</div>
              <div class="feature-title">Fast</div>
            </div>
            <div class="feature">
              <div class="feature-icon">🔧</div>
              <div class="feature-title">Modular</div>
            </div>
            <div class="feature">
              <div class="feature-icon">📦</div>
              <div class="feature-title">Scalable</div>
            </div>
          </div>
          
          <div class="footer">
            Powered by NestJS • Node.js • TypeScript
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getHealthStatus() {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        PORT: process.env.PORT || '3000',
        NODE_ENV: process.env.NODE_ENV || 'development',
      },
      uptime: process.uptime(),
    };

    // Log environment variables for Azure monitoring
    this.logger.log(`Health check - PORT: ${healthData.environment.PORT}, NODE_ENV: ${healthData.environment.NODE_ENV}`);

    return healthData;
  }

  logWarning(): void {
    this.logger.warn(`This is a test warning log for Azure App Service logging verification. PORT: ${process.env.PORT || '3000'}`);
  }

  logError(): void {
    this.logger.error(`This is a test error log for Azure App Service logging verification. NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  }
}
