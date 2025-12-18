import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../../components/Products/ProductList";
import type { IProduct } from "../../services/Interface";
import axios from "axios";

const LaptopPage: React.FC = () => {
  const { id } = useParams();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) return;

        const res = await axios.get(
          `http://localhost:8080/api/products/get-by-category/${id}`
        );

        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [id]);

  return (
    <ProductList
      products={products}
      loading={loading}
      error={error}
    />
  );
};

export default LaptopPage;