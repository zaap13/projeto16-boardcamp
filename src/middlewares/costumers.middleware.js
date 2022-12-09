import { costumerSchema } from "../models/costumers.model.js";

export function costumerMiddleware(req, res, next) {
  const { error } = costumerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }
  next();
}
