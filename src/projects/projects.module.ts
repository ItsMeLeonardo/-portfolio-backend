import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Module } from '@nestjs/common';
import { Project, ProjectSchema } from './schemas/project.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudstorageModule } from 'src/cloudStorage/cloudstorage.module';

const schemaConfig = () => {
  const schema = ProjectSchema;
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
    MongooseModule.forFeatureAsync([
      { name: Project.name, useFactory: schemaConfig },
    ]),
    CloudstorageModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
