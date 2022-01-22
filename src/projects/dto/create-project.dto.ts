import * as Joi from 'joi';

export const createProjectSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),

  technologies: Joi.array().items(Joi.string()).required(),

  softSkills: Joi.array().items(Joi.string()).required(),
  repo: Joi.string().required(),
  website: Joi.string(),
});
