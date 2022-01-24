import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Technology, TechnologyDocument } from './schemas/technology.schema';
import { CloudStorageService } from '../cloudStorage/cloudstorage.service';
import { fromMapToObject } from '../utils/fromMapToObject';
import { groupBy } from '../utils/groupBy';

@Injectable()
export class TechnologyService {
  constructor(
    @InjectModel(Technology.name) private techModel: Model<TechnologyDocument>,
    private cloudStorage: CloudStorageService,
  ) {}

  async create(
    technology: Technology,
    icon: Express.Multer.File,
  ): Promise<TechnologyDocument> {
    const [mediaData, error] = await this.cloudStorage.uploadImage(icon);
    if (error) {
      throw new BadRequestException(`${error} cannot upload the icon`);
    }

    return await this.techModel.create({
      ...technology,
      icon: mediaData,
    });
  }

  async getAll() {
    return await this.techModel.find();
  }

  async getAllGroupByExpertise() {
    const technologies = await this.techModel.find();
    const grouped = groupBy(technologies, (tech) => tech.expertise);
    const groupedByExpertise = fromMapToObject(grouped);
    return groupedByExpertise;
  }

  async update(id: string, technology: any, icon?: Express.Multer.File) {
    try {
      // FIXME: this convert this in a pipe
      const tech = await this.techModel.findById(id);
      if (!tech) throw new BadRequestException('Technology not found');
      if (icon) {
        const [mediaData, error] = await this.cloudStorage.updateMedia(
          tech.icon.name,
          icon,
        );
        if (error) {
          throw new BadRequestException(`${error} cannot upload the icon`);
        }
        technology.icon = mediaData;
      }

      const updated = await this.techModel.findByIdAndUpdate(
        id,
        { ...technology },
        { new: true },
      );

      return updated;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(id: string) {
    const tech = await this.techModel.findById(id);
    if (!tech) {
      throw new BadRequestException('Technology not found');
    }

    const result = await this.techModel.deleteOne({ _id: id }).catch((err) => {
      throw new BadRequestException(err);
    });

    this.cloudStorage.deleteMedia(tech.icon.name);
    return result;
  }
}
