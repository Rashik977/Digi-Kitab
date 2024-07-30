export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  bookId: number;
  price: number;
}
