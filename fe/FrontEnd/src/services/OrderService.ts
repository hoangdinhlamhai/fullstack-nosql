import axiosClient from "./AxiosClient";
import type { CreateOrderRequest, IOrder } from "./Interface";

const OrderService = {
  create(data: CreateOrderRequest): Promise<IOrder> {
    return axiosClient
      .post<IOrder>("/api/order", data)
      .then(res => res.data);
  },

  getById(orderId: string): Promise<IOrder> {
    return axiosClient
      .get<IOrder>(`/api/order/${orderId}`)
      .then(res => res.data);
  }
};

export default OrderService;
