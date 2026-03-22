import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Health check del servidor' })
  health() {
    return {
      status: 'ok',
      service: 'NightPass API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
