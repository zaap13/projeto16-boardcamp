import { rentalSchema } from "../models/rentals.model";

export function rentalMiddleware(req, res, next) {
  const { error } = rentalSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }
  next();
}
