import { Module } from '@nestjs/common';

import { CloudStorageService } from './cloudstorage.service';
import { CloudStorageProvider } from './cloudstorage.provider';

@Module({
  providers: [CloudStorageService, CloudStorageProvider],
  exports: [CloudStorageService, CloudStorageProvider],
})
export class CloudstorageModule {}
