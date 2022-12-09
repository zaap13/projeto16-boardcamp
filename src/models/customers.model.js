import Joi from "joi";

export const costumerSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  cpf: Joi.string().required(),
  birthday: Joi.date(),
});
