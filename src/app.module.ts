import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { CloudstorageModule } from './cloudStorage/cloudstorage.module';
import { CloudStorageService } from './cloudStorage/cloudstorage.service';
@Module({
  imports: [CloudstorageModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [CloudStorageService, AppService],
})
export class AppModule {}
