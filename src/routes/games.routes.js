import { Router } from "express";
import { getGames, postGame } from "../controllers/games.controller.js";
import { gameMiddleware } from "../middlewares/games.middleware.js";

const router = Router();

router.get("/games", getGames); //implement

router.post("/games", gameMiddleware, postGame); //implement

export default router;
