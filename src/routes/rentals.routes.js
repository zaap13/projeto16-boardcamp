import { Router } from "express";
import { rentalMiddleware } from "../middlewares/rentals.middleware";

const router = Router();

router.get("/rentals"); //implement

router.post("/rentals", rentalMiddleware); //implement

router.post("/rentals/:id/return"); //implement

router.delete("/rentals/:id"); //implement

export default router;
