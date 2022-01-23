import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { JoiValidationPipe } from '../pipes/joivalidation.pipe';
import { ParseProjectPipe } from '../pipes/parseproject.pipe';
import { createProjectSchema } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { Project } from './schemas/project.schema';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/create')
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body(ParseProjectPipe, new JoiValidationPipe(createProjectSchema))
    project: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<any> {
    return this.projectsService.createProject(project, files);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectsService.getProjects();
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.projectsService.deleteProject(id);
  }
}
