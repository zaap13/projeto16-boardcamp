import { customerSchema } from "../models/customers.model.js";

export function customerMiddleware(req, res, next) {
  const { error } = customerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  next();
}
