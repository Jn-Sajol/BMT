import { Controller, Get, Post, Query, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { MetaAuthService } from '../application/services/meta-auth.service';
import { MetaAssetSyncService } from '../application/services/meta-asset-sync.service';
import { MetaBusinessService } from '../application/services/meta-business.service';
import { MetaPageService } from '../application/services/meta-page.service';
import { MetaAdAccountService } from '../application/services/meta-ad-account.service';
import { MetaInstagramService } from '../application/services/meta-instagram.service';
import { MetaPixelService } from '../application/services/meta-pixel.service';
import { MetaCatalogService } from '../application/services/meta-catalog.service';
import { MetaRelationshipSyncService } from '../application/services/meta-relationship-sync.service';
import { MetaBusinessRelationshipService } from '../application/services/meta-business-relationship.service';
import { MetaPageRelationshipService } from '../application/services/meta-page-relationship.service';
import { MetaAdAccountRelationshipService } from '../application/services/meta-ad-account-relationship.service';
import { ConnectResponseDto, CallbackResponseDto, ConnectionStatusDto, DisconnectResponseDto } from '../common/meta-auth.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('Meta Integration')
@Controller({ path: 'meta', version: '1' })
@UseGuards(AuthGuard)
export class MetaAuthController {
  constructor(
    private readonly metaAuthService: MetaAuthService,
    private readonly syncService: MetaAssetSyncService,
    private readonly businessService: MetaBusinessService,
    private readonly pageService: MetaPageService,
    private readonly adAccountService: MetaAdAccountService,
    private readonly instagramService: MetaInstagramService,
    private readonly pixelService: MetaPixelService,
    private readonly catalogService: MetaCatalogService,
    private readonly relSyncService: MetaRelationshipSyncService,
    private readonly businessRelService: MetaBusinessRelationshipService,
    private readonly pageRelService: MetaPageRelationshipService,
    private readonly adAccountRelService: MetaAdAccountRelationshipService,
  ) {}

  @Get('connect')
  @ApiOperation({ summary: 'Initiate Meta OAuth connect flow' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiHeader({ name: 'x-organization-id', required: true })
  async connect(@Req() req: any): Promise<ConnectResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const organizationId = req.headers['x-organization-id'] as string;
    const userId = req.user.id;
    return await this.metaAuthService.connect(workspaceId, organizationId, userId);
  }

  @Get('callback')
  @ApiOperation({ summary: 'Facebook OAuth callback redirect handler' })
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: any,
  ): Promise<CallbackResponseDto> {
    const userId = req.user.id;
    return await this.metaAuthService.callback(code, state, userId);
  }

  @Post('disconnect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disconnect Meta connection from current workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async disconnect(@Req() req: any): Promise<DisconnectResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.metaAuthService.disconnect(workspaceId, userId);
  }

  @Get('status')
  @ApiOperation({ summary: 'Fetch Meta connection status for current workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async status(@Req() req: any): Promise<ConnectionStatusDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.metaAuthService.status(workspaceId);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger discovery sync of Meta assets' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async sync(@Req() req: any): Promise<any> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.syncService.sync(workspaceId, userId);
  }

  @Get('businesses')
  @ApiOperation({ summary: 'Get discovered Meta Businesses for workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getBusinesses(@Req() req: any): Promise<any[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.businessService.getByWorkspace(workspaceId);
  }

  @Get('pages')
  @ApiOperation({ summary: 'Get discovered Meta Pages for workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getPages(@Req() req: any): Promise<any[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.pageService.getByWorkspace(workspaceId);
  }

  @Get('adaccounts')
  @ApiOperation({ summary: 'Get discovered Meta Ad Accounts for workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getAdAccounts(@Req() req: any): Promise<any[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.adAccountService.getByWorkspace(workspaceId);
  }

  @Get('instagram')
  @ApiOperation({ summary: 'Get discovered Instagram Accounts for workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getInstagram(@Req() req: any): Promise<any[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.instagramService.getByWorkspace(workspaceId);
  }

  @Get('pixels')
  @ApiOperation({ summary: 'Get discovered Meta Pixels for workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getPixels(@Req() req: any): Promise<any[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.pixelService.getByWorkspace(workspaceId);
  }

  @Get('catalogs')
  @ApiOperation({ summary: 'Get discovered Meta Catalogs for workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getCatalogs(@Req() req: any): Promise<any[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.catalogService.getByWorkspace(workspaceId);
  }

  @Post('sync-relationships')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger sync of Meta asset relationships' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async syncRelationships(@Req() req: any): Promise<any> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    return await this.relSyncService.syncRelationships(workspaceId, userId);
  }

  @Get('relationships/businesses')
  @ApiOperation({ summary: 'Get discovered Meta Business Page relationships for workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getBusinessRelationships(@Req() req: any): Promise<any[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.businessRelService.getByWorkspace(workspaceId);
  }

  @Get('relationships/pages')
  @ApiOperation({ summary: 'Get discovered Meta Page Instagram relationships for workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getPageRelationships(@Req() req: any): Promise<any[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.pageRelService.getByWorkspace(workspaceId);
  }

  @Get('relationships/adaccounts')
  @ApiOperation({ summary: 'Get discovered Meta Ad Account Pixel relationships for workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getAdAccountRelationships(@Req() req: any): Promise<any[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.adAccountRelService.getByWorkspace(workspaceId);
  }
}
