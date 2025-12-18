import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./product.module.css";

/* ===== BACKEND DTO ===== */
interface ProductDTO {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
}

/* ===== UI MODEL ===== */
interface SanPham {
  idSanPham: string;
  tenSanPham: string;
  soLuong: number;
  donGia: number;
  moTa: string;
}

const ProductPage: React.FC = () => {
  const navigate = useNavigate();

  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== FETCH PRODUCTS ===== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:8080/api/products", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Không thể tải danh sách sản phẩm");
        }

        const data: ProductDTO[] = await res.json();

        // 🔥 MAP DTO → UI
        const mapped: SanPham[] = data.map((p) => ({
          idSanPham: p.productId,
          tenSanPham: p.name,
          soLuong: p.stockQuantity,
          donGia: p.price,
          moTa: p.description,
        }));

        setSanPhams(mapped);
      } catch (err) {
        console.error("FETCH PRODUCT ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ===== FILTER ===== */
  const filteredRows = useMemo(() => {
    const keyword = search.toLowerCase();
    return sanPhams.filter((sp) =>
      sp.tenSanPham.toLowerCase().includes(keyword)
    );
  }, [sanPhams, search]);

  /* ===== HANDLERS ===== */
  const handleEdit = (id: string) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleAdd = () => {
    navigate("/admin/products/create");
  };

  /* ===== RENDER ===== */
  return (
    <main className={styles["main-content"]}>
      {/* SEARCH */}
      <div className={styles["search-bar"]}>
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.Title}>
        <h1>QUẢN LÝ SẢN PHẨM</h1>
      </div>

      {/* ACTION */}
      <div className={styles["add-button"]}>
        <button className={styles["filter-btn"]}>
          Tất cả ({filteredRows.length})
        </button>
        <button className={styles.add} onClick={handleAdd}>
          Thêm mới <span className={styles["plus-sign"]}>+</span>
        </button>
      </div>

      {/* TABLE */}
      <section className={styles["table-container"]}>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className={styles["product-table"]}>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Không có sản phẩm
                  </td>
                </tr>
              ) : (
                filteredRows.map((item) => (
                  <tr
                    key={item.idSanPham}
                    onClick={() => handleEdit(item.idSanPham)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.idSanPham}</td>
                    <td>{item.tenSanPham}</td>
                    <td>{item.soLuong}</td>
                    <td>{item.donGia.toLocaleString()}</td>
                    <td>{item.moTa}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
};

export default ProductPage;
