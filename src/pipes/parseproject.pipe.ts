import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseProjectPipe implements PipeTransform {
  transform(value: any) {
    const { technologies, softSkills } = value;
    if (!(technologies || softSkills)) {
      return { ...value };
    }

    const val = {
      ...value,
      technologies: JSON.parse(technologies),
      softSkills: JSON.parse(softSkills),
    };

    return val;
  }
}
