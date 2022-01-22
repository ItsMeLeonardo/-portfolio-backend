import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}
  transform(value: any) {
    const { error } = this.schema.validate(value);

    if (error) {
      console.log({ error, value });

      throw new BadRequestException('the project is not correct ');
    }

    return value;
  }
}
