import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('System')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'System Health Check Status' })
  @ApiResponse({ status: 200, description: 'Service is active and connected' })
  checkHealth() {
    return {
      status: 'ok',
      service: 'JNS Marketing OS API',
      version: '1.0.0',
    };
  }
}
