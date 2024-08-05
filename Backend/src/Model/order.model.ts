import { Order, OrderItem } from "../Interfaces/Order.interface";
import { BaseModel } from "./base.model";

export class OrderModel extends BaseModel {
  // function to create a new order
  static async createOrder(order: Partial<Order>, userId: number) {
    return this.queryBuilder()
      .insert({ ...order, userId })
      .returning("*")
      .table("orders");
  }

  // function to create a new order item
  static async createOrderItem(orderItem: Partial<OrderItem>) {
    return this.queryBuilder().insert(orderItem).table("order_items");
  }

  // function to get order by ID
  static async getOrderById(orderId: number) {
    return this.queryBuilder()
      .select("*")
      .from("orders")
      .where({ id: orderId })
      .first();
  }

  // function to get order items by order ID
  static async getOrderItemsByOrderId(orderId: number) {
    return this.queryBuilder()
      .select("*")
      .from("orderItems")
      .where({ orderId });
  }
}
