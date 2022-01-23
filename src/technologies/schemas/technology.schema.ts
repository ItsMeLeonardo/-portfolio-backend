import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Technology {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  webpage: string;

  @Prop({ required: true })
  expertise: string;
}

export type TechnologyDocument = Technology & Document;
export const TechnologySchema = SchemaFactory.createForClass(Technology);
