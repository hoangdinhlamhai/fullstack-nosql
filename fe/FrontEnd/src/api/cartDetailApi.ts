import axios from "axios";

export const addCartDetail = async (
  cartId: string,
  productId: string
) => {
  const res = await axios.post("http://localhost:8080/api/cart-details", {
    cartId,
    productId
  });
  return res.data;
};

export const getAllCartDetails = async () => {
  const res = await axios.get("http://localhost:8080/api/cart-details");
  return res.data;
};

export const deleteOneCartDetailByProductId = async (productId: string) => {
  return axios.delete(
    `http://localhost:8080/api/cart-details/deleteByProductId/${productId}`
  );
};

export const deleteAllCartDetailsByProductId = async (productId: string) => {
  return axios.delete(
    `http://localhost:8080/api/cart-details/deleteAll/${productId}`
  );
};