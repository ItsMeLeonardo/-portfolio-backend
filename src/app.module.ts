import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';

import { CloudStorageService } from './cloudStorage/cloudstorage.service';
import { CloudstorageModule } from './cloudStorage/cloudstorage.module';
import { TechnologyModule } from './technologies/technology.module';
import { ProjectsModule } from './projects/projects.module';
@Module({
  imports: [
    TechnologyModule,
    ProjectsModule,
    CloudstorageModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  controllers: [AppController],
  providers: [CloudStorageService, AppService],
})
export class AppModule {}
