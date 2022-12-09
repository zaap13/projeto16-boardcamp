import { Router } from "express";
import {
  getCategories,
  postCategory,
} from "../controllers/categories.controller.js";
import { categoryMiddleware } from "../middlewares/categories.middleware.js";

const router = Router();

router.get("/categories", getCategories); //implement

router.post("/categories", categoryMiddleware, postCategory); //implement

export default router;
