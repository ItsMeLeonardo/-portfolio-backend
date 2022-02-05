import { BadRequestException } from '@nestjs/common';

const Expertise = {
  COMING_SOON: 'comingSoon',
  ADVANCED: 'advanced',
  MEDIUM: 'medium',
  OTHER: 'other',
};

export enum ExpertiseEnum {
  COMING_SOON = 'comingSoon',
  ADVANCED = 'advanced',
  MEDIUM = 'medium',
  OTHER = 'other',
}

export const validateExpertise = (expertise: string) => {
  if (!Object.values(Expertise).includes(expertise)) {
    throw new BadRequestException(`${expertise} is not a valid expertise`);
  }
};
