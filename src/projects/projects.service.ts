import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CloudStorageService } from '../cloudStorage/cloudstorage.service';
import type { mediaType } from '../cloudStorage/cloudstorage.service';
import { Project, ProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private cloudStorage: CloudStorageService,
  ) {}

  async uploadMedia(file: Express.Multer.File): Promise<mediaType> {
    const [mediaData, error] = await this.cloudStorage.uploadImage(file);
    if (error) {
      throw new BadRequestException(error);
    }
    return mediaData;
  }

  async uploadMultipleMedia(
    files: Express.Multer.File[],
  ): Promise<mediaType[]> {
    const promises = files.map((file) => this.uploadMedia(file));
    return await Promise.all(promises);
  }

  async createProject(
    project: Project,
    files: Express.Multer.File[],
  ): Promise<Project> {
    const demoFile = files.find(
      (file: Express.Multer.File) => file.fieldname === 'demo',
    );
    const posterFile = files.find(
      (file: Express.Multer.File) => file.fieldname === 'poster',
    );
    const screenFiles = files.filter(
      (file: Express.Multer.File) => file.fieldname === 'screens',
    );

    const demo = await this.uploadMedia(demoFile);
    const poster = await this.uploadMedia(posterFile);
    const screens = await this.uploadMultipleMedia(screenFiles);

    const createProject = new this.projectModel({
      ...project,
      demo,
      poster,
      screens,
    });
    return await createProject.save();
  }

  async getProjects(): Promise<ProjectDocument[]> {
    return await this.projectModel.find().exec();
  }
}
