import * as Joi from 'joi';

export const createTechSchema = Joi.object({
  name: Joi.string().required(),
  // icon: Joi.any().required(),
  webpage: Joi.string().required(),
  expertise: Joi.string().required(),
});
