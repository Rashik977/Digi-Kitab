import { Response, NextFunction } from "express";
import { createOrder, getOrderById } from "../Services/order.services";
import { Request } from "../Interfaces/Auth.interface";
import loggerWithNameSpace from "../Utils/logger";
import { log } from "winston";

const logger = loggerWithNameSpace("OrderController");

// function to place an order
export const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Placing order");
    const { orderDetails, orderItems } = req.body;
    const userId = req.user!.id;
    const order = await createOrder(orderDetails, orderItems, parseInt(userId));
    res.status(201).json(order);
  } catch (error) {
    logger.error("Error placing order", { error });
    next(error);
  }
};

// function to get an order by ID
export const getOrder = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Getting order by ID");
    const { id } = req.params;
    const order = await getOrderById(Number(id));
    res.status(200).json(order);
  } catch (error) {
    logger.error("Error getting order by ID", { error });
    next(error);
  }
};
