import {
  Body,
  Controller,
  Get,
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
    projectData: any,
    @UploadedFiles() files,
  ): Promise<any> {
    const demoFile = files.find((file) => file.fieldname === 'demo');
    const posterFile = files.find((file) => file.fieldname === 'poster');
    const screenFiles = files.filter((file) => file.fieldname === 'screens');

    const demoUrl = await this.projectsService.uploadMedia(demoFile);
    const posterUrl = await this.projectsService.uploadMedia(posterFile);
    const screenUrls = await this.projectsService.uploadMultipleMedia(
      screenFiles,
    );

    const project = {
      ...projectData,
      poster: posterUrl,
      demo: demoUrl,
      screens: screenUrls,
    };

    return this.projectsService.createProject(project);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectsService.getProjects();
  }
}
