import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import type { IProduct } from '../../services/Interface';
import './ProductList.css';

interface ProductListProps {
  products: IProduct[];
  loading: boolean;
  error: string | null;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  error,
}) => {
  // const [products, setProducts] = useState<IProduct[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //       const fetchProducts = async () => {
  //           try {
  //               setLoading(true);
  //               const data = await getAllProducts();
  //               setProducts(data);
  //           } catch (err) {
  //               console.error(err, error);
  //               setError("Không thể tải danh sách sản phẩm.");
  //           } finally {
  //               setLoading(false);
  //           }
  //       };

  //       fetchProducts();
  //   }, []);

  return (
    <div className="product-list-page">
      <div className="product-container">
        <div className="page-header">
          <h1 className="page-title">Tất cả sản phẩm</h1>
          <p className="product-count">{products.length} sản phẩm</p>
        </div>

        <div className="filter-bar">
          <select defaultValue="">
            <option value="" disabled>Sắp xếp theo</option>
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="bestseller">Bán chạy</option>
          </select>
        </div>

        {loading && <div className="loading">Đang tải sản phẩm...</div>}

        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <div className="product-grid-inner">
            {products.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
              />
            ))}
          </div>
        )}

        {products.length === 0 && !loading && !error && (
          <div className="empty-state">Không tìm thấy sản phẩm nào.</div>
        )}
      </div>
    </div>
  );
};

export default ProductList;