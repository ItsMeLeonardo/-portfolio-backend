import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Technology, TechnologyDocument } from '../schemas/technology.schema';

@Injectable()
export class TechnologyByIdPipe implements PipeTransform {
  constructor(
    @InjectModel(Technology.name) private techModel: Model<TechnologyDocument>,
  ) {}
  async transform(value: string) {
    try {
      const technology = await this.techModel.findById(value);
      if (!technology) {
        throw new BadRequestException('Technology not found');
      }
      return technology;
    } catch (error) {
      throw new BadRequestException('The id is not valid');
    }
  }
}
