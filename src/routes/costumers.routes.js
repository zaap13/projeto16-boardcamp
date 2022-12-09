import { Router } from "express";
import { costumerMiddleware } from "../middlewares/costumers.middleware";

const router = Router();

router.get("/customers"); //implement

router.get("/customers/:id"); //implement

router.put("/customers/:id", costumerMiddleware); //implement

router.post("/customers", costumerMiddleware); //implement

export default router;
