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
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { JoiValidationPipe } from '../pipes/joivalidation.pipe';
import { ParseProjectPipe } from '../pipes/parseproject.pipe';
import { createProjectSchema } from './dto/create-project.dto';
import { ProjectByIdPipe } from './pipes/projectbyid.pipe';
import { ProjectsService } from './projects.service';
import { Project } from './schemas/project.schema';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectsService.getProjects();
  }
  /* ========== endpoints only for tool ui ========== */
  @Get('/tool')
  async findAllForToolUi() {
    return await this.projectsService.findAllForToolUi();
  }

  @Post('/create')
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body(ParseProjectPipe, new JoiValidationPipe(createProjectSchema))
    project: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Project> {
    return this.projectsService.createProject(project, files);
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id', ProjectByIdPipe) projectToUpdate: any,
    @Body(ParseProjectPipe) project: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.projectsService.updateProject(projectToUpdate, project, files);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.projectsService.deleteProject(id);
  }
}
