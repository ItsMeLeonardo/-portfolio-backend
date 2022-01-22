import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Technology } from '../../technologies/schemas/technology.schema';

const OBJECT_ID = mongoose.Schema.Types.ObjectId;

@Schema()
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  softSkills: string[];

  @Prop({ required: true })
  repo: string;

  @Prop()
  website: string;

  @Prop({
    type: [{ type: OBJECT_ID, ref: 'Technology', required: true }],
  })
  technologies: Technology[];

  @Prop({ required: true })
  poster: string;

  @Prop()
  demo: string;

  @Prop({ required: true })
  screens: string[];
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
