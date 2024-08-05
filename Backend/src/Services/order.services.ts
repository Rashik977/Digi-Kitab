import { Order, OrderItem } from "../Interfaces/Order.interface";
import * as OrderModel from "../Model/order.model";

// create a new order
export async function createOrder(
  orderDetails: Partial<Order>,
  orderItems: Partial<OrderItem>[],
  userId: number
) {
  orderDetails.totalAmount = orderItems.reduce(
    (acc, item) => acc + (item?.price ?? 0),
    0
  );
  const order = await OrderModel.OrderModel.createOrder(orderDetails, userId);
  const orderId = order[0].id;

  for (const item of orderItems) {
    await OrderModel.OrderModel.createOrderItem({ ...item, orderId });
  }

  return order;
}

// get order by ID
export async function getOrderById(orderId: number) {
  const order = await OrderModel.OrderModel.getOrderById(orderId);
  const items = await OrderModel.OrderModel.getOrderItemsByOrderId(orderId);
  return { ...order, items };
}
