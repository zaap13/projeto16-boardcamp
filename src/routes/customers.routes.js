import { Router } from "express";
import {
  getCustomer,
  getCustomers,
  postCustomer,
  putCustomer,
} from "../controllers/customers.controller.js";
import { customerMiddleware } from "../middlewares/customers.middleware.js";

const router = Router();

router.get("/customers", getCustomers); //implement

router.get("/customers/:id", getCustomer); //implement

router.put("/customers/:id", customerMiddleware, putCustomer); //implement

router.post("/customers", customerMiddleware, postCustomer); //implement

export default router;
