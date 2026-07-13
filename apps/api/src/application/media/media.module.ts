import { Module } from '@nestjs/common';
import { MediaController } from './presentation/media.controller';
import { MediaUploadService } from './services/media-upload.service';
import { MediaValidationService } from './services/media-validation.service';
import { MediaHistoryService } from './services/media-history.service';
import { MetaMediaUploader } from './services/meta-media-uploader';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { SecurityModule } from '../../infrastructure/security/security.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, SecurityModule, AuthModule],
  controllers: [MediaController],
  providers: [
    MediaUploadService,
    MediaValidationService,
    MediaHistoryService,
    MetaMediaUploader,
  ],
  exports: [
    MediaUploadService,
    MediaHistoryService,
  ],
})
export class MediaModule {}
