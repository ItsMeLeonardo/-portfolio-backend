import * as mongoose from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Technology } from '../../technologies/schemas/technology.schema';

const OBJECT_ID = mongoose.Schema.Types.ObjectId;

const mediaType = {
  url: { type: String, required: true },
  name: { type: String, required: true },
};

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

  @Prop(raw(mediaType))
  poster: any;

  @Prop(raw(mediaType))
  demo: any;

  @Prop(raw([mediaType]))
  screens: Array<any>;
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
