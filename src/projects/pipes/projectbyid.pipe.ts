import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Project, ProjectDocument } from '../schemas/project.schema';

@Injectable()
export class ProjectByIdPipe implements PipeTransform {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}
  async transform(value: string) {
    try {
      const project = await this.projectModel.findById(value);
      if (!project) {
        throw new BadRequestException('Project not found');
      }
      return project;
    } catch (error) {
      throw new BadRequestException('The id is not valid');
    }
  }
}
