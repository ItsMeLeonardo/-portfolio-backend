import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { CloudstorageModule } from 'src/cloudStorage/cloudstorage.module';
import { TechnologyController } from './technology.controller';
import { TechnologyService } from './technology.service';
import { Technology, TechnologySchema } from './schemas/technology.schema';

const schemaConfig = () => {
  const schema = TechnologySchema;
  schema.set('toJSON', {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  });
  return schema;
};

@Module({
  imports: [
    CloudstorageModule,
    MongooseModule.forFeatureAsync([
      {
        name: Technology.name,
        useFactory: schemaConfig,
      },
    ]),
  ],
  controllers: [TechnologyController],
  providers: [TechnologyService],
})
export class TechnologyModule {}
