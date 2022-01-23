import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { JoiValidationPipe } from 'src/pipes/joivalidation.pipe';
import { TechnologyService } from './technology.service';
import { createTechSchema } from './dto/create-tech.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { InjectConnection } from '@nestjs/mongoose';

@Controller('tech')
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Get()
  async getAll() {
    const all = await this.technologyService.getAll();
    return { all };
  }

  @Get('grouped')
  async getAllGroupByExpertise() {
    return this.technologyService.getAllGroupByExpertise();
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body(new JoiValidationPipe(createTechSchema)) technology,
    @UploadedFiles() icon: Express.Multer.File[],
  ) {
    return this.technologyService.create(technology, icon.at(0));
  }

  @Put(':id')
  update(@Param('id') id: string) {
    return null;
  }
}
