import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Project, ProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async createProject(project: Project): Promise<Project> {
    const createProject = new this.projectModel(project);
    return await createProject.save();
  }

  async getProjects(): Promise<ProjectDocument[]> {
    return await this.projectModel.find().exec();
  }
}
