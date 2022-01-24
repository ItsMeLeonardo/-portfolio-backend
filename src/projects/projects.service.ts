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

  private async updateMultipleMedia(
    medias: mediaType[],
    files: Express.Multer.File[],
  ) {
    const promises = medias.map((media, index) =>
      this.updateMedia(media, files.at(index)),
    );
    return await Promise.all(promises);
  }

  async createProject(
    project: Project,
    files: Express.Multer.File[],
  ): Promise<any> {
    const grouped = groupBy(files, (file) => file.fieldname);

    const demo = await this.uploadMedia(grouped.get('demo').at(0));
    const poster = await this.uploadMedia(grouped.get('poster').at(0));
    const screens = await this.uploadMultipleMedia(grouped.get('screens'));

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

  async updateProject(id: string, project: any, files?: Express.Multer.File[]) {
    try {
      // FIXME: this convert this in a pipe
      const projectToUpdate = await this.projectModel.findById(id);
      if (!projectToUpdate) throw new BadRequestException('Project not found');

      if (files) {
        const grouped = groupBy(files, (file) => file.fieldname);

        if (grouped.has('demo')) {
          const demo = await this.updateMedia(
            projectToUpdate.demo,
            grouped.get('demo').at(0),
          );
          project.demo = demo;
        }
        if (grouped.has('poster')) {
          const poster = await this.updateMedia(
            projectToUpdate.poster,
            grouped.get('poster').at(0),
          );
          project.poster = poster;
        }
        if (grouped.has('screens')) {
          const screensToProject = projectToUpdate.screens;
          const screensGrouped = grouped.get('screens');
          const screens = [...screensToProject];
          for (let index = 0; index < screensGrouped.length; index++) {
            const screen = await this.updateMedia(
              screensToProject.at(index),
              screensGrouped.at(index),
            );
            screens[index] = screen;
          }
          project.screens = screens;
        }
      }

      const updated = this.projectModel.findByIdAndUpdate(
        id,
        { ...project },
        { new: true },
      );
      return updated;
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
