import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Technology, TechnologyDocument } from './schemas/technology.schema';
import { CloudStorageService } from '../cloudStorage/cloudstorage.service';
import { fromMapToObject } from '../utils/fromMapToObject';
import { validateExpertise } from './enums/expertise.enum';
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
    validateExpertise(technology.expertise);
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

  async update(tech: any, technology: any, icon?: Express.Multer.File) {
    const { expertise } = technology;
    if (expertise) validateExpertise(expertise);

    try {
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
        tech.id,
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
