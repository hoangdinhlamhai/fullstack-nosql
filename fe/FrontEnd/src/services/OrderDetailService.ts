import axiosClient from "./AxiosClient";
import type { CreateOrderDetailRequest, IOrderDetail } from "./Interface";

const OrderDetailService = {
  create(data: CreateOrderDetailRequest): Promise<IOrderDetail> {
    return axiosClient
      .post<IOrderDetail>("/api/order-details", data)
      .then(res => res.data);
  },

  getByOrderId(orderId: string): Promise<IOrderDetail[]> {
    return axiosClient
      .get<IOrderDetail[]>(`/api/order-details/order/${orderId}`)
      .then(res => res.data);
  }
};

export default OrderDetailService;
