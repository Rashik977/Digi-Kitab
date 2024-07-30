import { Router } from "express";
import { placeOrder, getOrder } from "../Controller/order.controller";
import { authenticate } from "../Middleware/auth.middleware";
import { authorize } from "../Middleware/auth.middleware";

const orderRoutes = Router();

orderRoutes.post("/", authenticate, authorize("order.post"), placeOrder);
orderRoutes.get("/:id", authenticate, authorize("order.get"), getOrder);

export default orderRoutes;