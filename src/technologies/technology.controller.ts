import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { JoiValidationPipe } from 'src/pipes/joivalidation.pipe';
import { TechnologyService } from './technology.service';
import { createTechSchema } from './dto/create-tech.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { TechnologyByIdPipe } from './pipes/technologybyid.pipe';

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
    return this.technologyService.create(technology, icon[0]);
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id', TechnologyByIdPipe) tech: any,
    @Body() technology: any,
    @UploadedFiles() icon: Express.Multer.File[],
  ) {
    return this.technologyService.update(tech, technology, icon[0]);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.technologyService.delete(id);
  }
}
