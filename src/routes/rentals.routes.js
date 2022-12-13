import { Router } from "express";
import {
  deleteRent,
  getRentals,
  postRent,
  returnRent,
} from "../controllers/rentals.controller.js";
import { rentalMiddleware } from "../middlewares/rentals.middleware.js";

const router = Router();

router.get("/rentals", getRentals);

router.post("/rentals", rentalMiddleware, postRent);

router.post("/rentals/:id/return", returnRent);

router.delete("/rentals/:id", deleteRent);

export default router;
