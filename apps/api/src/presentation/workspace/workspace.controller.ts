import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('workspaces')
@Controller('workspaces')
export class WorkspaceController {
  @Get()
  @ApiOperation({ summary: 'Get all workspaces for user' })
  async getWorkspaces() {
    return [
      {
        id: 'workspace-1',
        name: 'Corporate Workspace',
        slug: 'corporate-workspace',
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  async createWorkspace(@Body() body: any) {
    return {
      id: `workspace-${Date.now()}`,
      name: body.name || 'New Workspace',
      slug: (body.name || 'new-workspace').toLowerCase().replace(/\s+/g, '-'),
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
    };
  }
}
