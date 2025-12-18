import axios from "axios";

const API_URL = "http://localhost:8080/api/carts";

export const createCart = async (userId: string) => {
  const res = await axios.post(API_URL, {
    userId,
    status: "ACTIVE"
  });
  return res.data;
};

export const getCartByUserId = async (userId: string) => {
  const res = await axios.get(`http://localhost:8080/api/carts/${userId}`);
  return res.data;
};
