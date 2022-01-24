import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ExpertiseEnum } from '../enums/expertise.enum';

const iconType = {
  url: { type: String, required: true },
  name: { type: String, required: true },
};

@Schema()
export class Technology {
  @Prop({ required: true })
  name: string;

  @Prop(raw(iconType))
  icon: any;

  @Prop({ required: true })
  webpage: string;

  @Prop({ required: true })
  expertise: ExpertiseEnum;
}

export type TechnologyDocument = Technology & Document;
export const TechnologySchema = SchemaFactory.createForClass(Technology);
