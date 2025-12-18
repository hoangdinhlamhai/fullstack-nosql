import axios from "axios";
import type { IOrder } from "../services/Interface";

export const createOrder = async (data: any) => {
  const res = await axios.post("http://localhost:8080/api/order", data);
  return res.data;
};


export const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
  console.log("📡 CALL API getOrdersByUser, userId =", userId);

  const res = await axios.get(
    `http://localhost:8080/api/order/user/${userId}`
  );

  console.log("📡 API RESPONSE =", res.data);

  return res.data;
};
