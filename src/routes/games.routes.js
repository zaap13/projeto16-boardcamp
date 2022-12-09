import { Router } from "express";
import { gameMiddleware } from "../middlewares/games.middleware";

const router = Router();

router.get("/games"); //implement

router.post("/games", gameMiddleware); //implement

export default router;
