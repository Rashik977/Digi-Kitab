import { Order, OrderItem } from "../Interfaces/Order.interface";
import { BaseModel } from "./base.model";

export class OrderModel extends BaseModel {
  static async createOrder(order: Partial<Order>, userId: number) {
    return this.queryBuilder()
      .insert({ ...order, userId })
      .returning("*")
      .table("orders");
  }

  static async createOrderItem(orderItem: Partial<OrderItem>) {
    return this.queryBuilder().insert(orderItem).table("order_items");
  }

  static async getOrderById(orderId: number) {
    return this.queryBuilder()
      .select("*")
      .from("orders")
      .where({ id: orderId })
      .first();
  }

  static async getOrderItemsByOrderId(orderId: number) {
    return this.queryBuilder()
      .select("*")
      .from("orderItems")
      .where({ orderId });
  }
}
