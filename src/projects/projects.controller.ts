import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { JoiValidationPipe } from '../validationPipes/joivalidation.pipe';
import { createProjectSchema } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { Project } from './schemas/project.schema';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/create')
  @UsePipes(new JoiValidationPipe(createProjectSchema))
  async create(@Body() project: Project): Promise<Project> {
    console.log({ project });
    return this.projectsService.createProject(project);
  }

  @Post('/create/assets')
  @UseInterceptors(AnyFilesInterceptor())
  async createAssets(@UploadedFiles() files) {
    console.log({ files });

    return 'assets';
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectsService.getProjects();
  }
}
