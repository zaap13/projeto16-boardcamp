import { gameSchema } from "../models/games.model.js";

export function gameMiddleware(req, res, next) {
  const { error } = gameSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }
  next();
}
