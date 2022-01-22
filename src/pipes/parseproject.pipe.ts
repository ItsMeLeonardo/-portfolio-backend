import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseProjectPipe implements PipeTransform {
  transform(value: any) {
    const { technologies, softSkills } = value;
    if (!(technologies || softSkills)) {
      throw new BadRequestException('the project has some fields missing');
    }

    const val = {
      ...value,
      technologies: JSON.parse(technologies),
      softSkills: JSON.parse(softSkills),
    };

    return val;
  }
}
