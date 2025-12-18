import React, { useEffect, useState } from "react";
import ProductList from "../../components/Products/ProductList";
import type { IProduct } from "../../services/Interface";
import { getAllProducts } from "../../api/productApi";
import paymentService from "../../services/PaymentService";

const Home: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); 
        const data = await getAllProducts(); 
        setProducts(data);
      } catch (err) {
        console.error(err); 
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) return;

    paymentService.completePayPalPayment(token)
      .finally(() => {
        // xoá token khỏi URL cho sạch
        window.history.replaceState({}, "", "/");
      });
  }, []);


  return (
    <ProductList
      products={products}
      loading={loading}
      error={error}
    />
  );
};

export default Home;
