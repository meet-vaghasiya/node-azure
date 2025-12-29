import { Controller, Get, Header, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getHome(): string {
    return this.appService.getHomePage();
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealthStatus();
  }

  @Get('log-warning')
  logWarning(): string {
    this.appService.logWarning();
    return 'Warning logged successfully. Check Azure App Service logs.';
  }

  @Get('log-error')
  logError(): string {
    this.appService.logError();
    return 'Error logged successfully. Check Azure App Service logs.';
  }

  @Get('crash')
  crashApp(): void {
    process.exit(1);
  }

  @Get('error-crash')
  errorCrash(): string {
    // Schedule an unhandled error to be thrown asynchronously after response is sent
    setImmediate(() => {
      throw new Error('Simulated unhandled error that crashes the app');
    });
    return 'Error scheduled to crash the app. Check logs.';
  }

  @Get('status-506')
  @HttpCode(506)
  getStatus506(): string {
    return 'Variant Also Negotiates';
  }
}
