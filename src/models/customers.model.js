import Joi from "joi";

export const customerSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().regex(/^\d+$/).required().min(10).max(11),
  cpf: Joi.string().regex(/^\d+$/).required().min(11).max(11),
  birthday: Joi.date().required(),
});
