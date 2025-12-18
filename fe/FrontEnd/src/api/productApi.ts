import axios from 'axios';
import type { IProduct } from '../services/Interface';

const API_URL = 'http://localhost:8080/api/products';

export const getAllProducts = async (): Promise<IProduct[]> => {
    try {
        const response = await axios.get<IProduct[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API products:", error);
        throw error; // Ném lỗi để component xử lý hoặc hiển thị thông báo
    }
};

export async function getProductById(productId: string): Promise<IProduct> {
  const res = await fetch(`${API_URL}/${productId}`);

  if (!res.ok) {
    throw new Error("Lỗi khi lấy sản phẩm " + productId);
  }

  return res.json();
}