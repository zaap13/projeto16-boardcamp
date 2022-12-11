import { Router } from "express";
import { getRentals, postRent } from "../controllers/rentals.controller.js";
import { rentalMiddleware } from "../middlewares/rentals.middleware.js";

const router = Router();

router.get("/rentals", getRentals); //implement

router.post("/rentals", rentalMiddleware, postRent); //implement

router.post("/rentals/:id/return"); //implement

router.delete("/rentals/:id"); //implement

export default router;
