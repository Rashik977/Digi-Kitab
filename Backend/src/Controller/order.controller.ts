import { Response, NextFunction } from "express";
import { createOrder, getOrderById } from "../Services/order.services";
import { Request } from "../Interfaces/Auth.interface";

export const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderDetails, orderItems } = req.body;
    const userId = req.user!.id;
    const order = await createOrder(orderDetails, orderItems, parseInt(userId));
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(Number(id));
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
