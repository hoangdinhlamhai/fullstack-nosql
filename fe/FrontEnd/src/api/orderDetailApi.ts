import axios from "axios";
import type { IOrderDetail } from "../services/Interface";

export const createOrderDetail = async (data: any) => {
  const res = await axios.post("http://localhost:8080/api/order-details", data);
  return res.data;
};

export const getOrderDetailsByOrderId = async (
  orderId: string
): Promise<IOrderDetail[]> => {
  console.log("📡 CALL order-details API, orderId =", orderId);

  const res = await axios.get(
    `http://localhost:8080/api/order-details/order/${orderId}`
  );

  console.log("📡 order-details RESPONSE =", res.data);
  return res.data;
};