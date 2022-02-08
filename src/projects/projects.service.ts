import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CloudStorageService } from '../cloudStorage/cloudstorage.service';
import type { mediaType } from '../cloudStorage/cloudstorage.service';
import { Project, ProjectDocument } from './schemas/project.schema';
import { groupBy } from '../utils/groupBy';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private cloudStorage: CloudStorageService,
  ) {}

  async getProjects(): Promise<ProjectDocument[]> {
    return await this.projectModel.find().populate('technologies').exec();
  }

  /* ========== endpoints only for tool ui ========== */
  async findAllForToolUi() {
    return await this.projectModel
      .find()
      .select({ id: 1, title: 1, poster: 1 });
  }

  private async uploadMedia(file: Express.Multer.File): Promise<mediaType> {
    const [mediaData, error] = await this.cloudStorage.uploadImage(file);
    if (error) {
      throw new BadRequestException(error);
    }
    return mediaData;
  }

  private async uploadMultipleMedia(
    files: Express.Multer.File[],
  ): Promise<mediaType[]> {
    const promises = files.map((file) => this.uploadMedia(file));
    return await Promise.all(promises);
  }

  private async deleteMedia(media: mediaType) {
    const [result, error] = await this.cloudStorage.deleteMedia(media.name);
    if (error) {
      throw new BadRequestException(error);
    }
    return result;
  }

  private async deleteMultipleMedia(medias: mediaType[]) {
    const promises = medias.map((media) => this.deleteMedia(media));
    return await Promise.all(promises);
  }

  private async updateMedia(media: mediaType, file: Express.Multer.File) {
    const [result, error] = await this.cloudStorage.updateMedia(
      media.name,
      file,
    );
    if (error) {
      throw new BadRequestException(error);
    }
    return result;
  }

  async createProject(
    project: Project,
    files: Express.Multer.File[],
  ): Promise<any> {
    const grouped = groupBy(files, (file) => file.fieldname);

    const demo = await this.uploadMedia(grouped.get('demo')[0]);
    const poster = await this.uploadMedia(grouped.get('poster')[0]);
    const screens = await this.uploadMultipleMedia(grouped.get('screens'));

    const createProject = new this.projectModel({
      ...project,
      demo,
      poster,
      screens,
    });
    return await createProject.save();
  }

  async updateProject(
    projectToUpdate: any,
    project: any,
    files?: Express.Multer.File[],
  ) {
    try {
      if (files) {
        const grouped = groupBy(files, (file) => file.fieldname);

        if (grouped.has('demo')) {
          const demo = await this.updateMedia(
            projectToUpdate.demo,
            grouped.get('demo')[0],
          );
          project.demo = demo;
        }
        if (grouped.has('poster')) {
          const poster = await this.updateMedia(
            projectToUpdate.poster,
            grouped.get('poster')[0],
          );
          project.poster = poster;
        }
        if (grouped.has('screens')) {
          const screensToProject = projectToUpdate.screens;
          const screensGrouped = grouped.get('screens');
          const screens = [...screensToProject];
          for (let index = 0; index < screensGrouped.length; index++) {
            const screen = await this.updateMedia(
              screensToProject[index],
              screensGrouped[index],
            );
            screens[index] = screen;
          }
          project.screens = screens;
        }
      }

      const updated = this.projectModel.findByIdAndUpdate(
        projectToUpdate.id,
        { ...project },
        { new: true },
      );
      return updated.select({ id: 1, title: 1, poster: 1 });
    } catch (error) {
      console.log({ error });
      throw new BadRequestException(error);
    }
  }

  async deleteProject(id: string) {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new BadRequestException('Project not found');
    }

    const result = await this.projectModel
      .deleteOne({ _id: id })
      .catch((err) => {
        throw new BadRequestException(err);
      });

    await this.deleteMedia(project.demo);
    await this.deleteMedia(project.poster);
    await this.deleteMultipleMedia(project.screens);

    return result;
  }
}
