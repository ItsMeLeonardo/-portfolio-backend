import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Project, ProjectDocument } from './schemas/project.schema';
import { CloudStorageService } from '../cloudStorage/cloudstorage.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private cloudStorage: CloudStorageService,
  ) {}

  async uploadMedia(file: Express.Multer.File): Promise<string> {
    const [url, error] = await this.cloudStorage.uploadImage(file);
    if (error) {
      throw new BadRequestException(error);
    }
    return url;
  }

  async uploadMultipleMedia(files: Express.Multer.File[]): Promise<string[]> {
    const promises = files.map((file) => this.uploadMedia(file));
    return await Promise.all(promises);
  }

  async createProject(project: Project): Promise<Project> {
    const createProject = new this.projectModel(project);
    return await createProject.save();
  }

  async getProjects(): Promise<ProjectDocument[]> {
    return await this.projectModel.find().exec();
  }
}
