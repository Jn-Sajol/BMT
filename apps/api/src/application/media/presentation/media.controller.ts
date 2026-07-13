import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards, UseInterceptors, UploadedFile, HttpStatus, HttpCode } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaUploadService } from '../services/media-upload.service';
import { CreateMediaFolderDto, MediaFolderResponseDto, MediaAssetResponseDto } from '../common/media.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiHeader, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Media Library')
@Controller({ path: 'media', version: '1' })
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaUploadService) {}

  @Post('folders')
  @ApiOperation({ summary: 'Create Media folder' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async createFolder(
    @Body() dto: CreateMediaFolderDto,
    @Req() req: any,
  ): Promise<MediaFolderResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.mediaService.createFolder(dto, workspaceId);
  }

  @Get('folders')
  @ApiOperation({ summary: 'List Media folders' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getFolders(@Req() req: any): Promise<MediaFolderResponseDto[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.mediaService.getFolders(workspaceId);
  }

  @Delete('folders/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete Media folder' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async deleteFolder(@Param('id') id: string, @Req() req: any): Promise<void> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    await this.mediaService.deleteFolder(id, workspaceId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file to Media library and sync to Meta' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async uploadFile(
    @UploadedFile() file: any,
    @Req() req: any,
  ): Promise<MediaAssetResponseDto> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    const userId = req.user.id;
    const folderId = req.body.folderId as string | undefined;

    return await this.mediaService.upload(
      file.buffer,
      file.originalname,
      file.mimetype,
      workspaceId,
      userId,
      folderId,
    );
  }

  @Get('assets')
  @ApiOperation({ summary: 'List Media assets' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getAssets(@Req() req: any): Promise<MediaAssetResponseDto[]> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    return await this.mediaService.getAssets(workspaceId);
  }

  @Delete('assets/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete Media asset' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async deleteAsset(@Param('id') id: string, @Req() req: any): Promise<void> {
    const workspaceId = req.headers['x-workspace-id'] as string;
    await this.mediaService.deleteAsset(id, workspaceId);
  }
}
