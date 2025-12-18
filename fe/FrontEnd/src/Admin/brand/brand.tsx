import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./brand.module.css";

/* ===== DTO frontend ===== */
interface Brand {
  id: string;
  name: string;
}

const BrandManagement: React.FC = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  /* ===== FETCH ALL BRANDS ===== */
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/brands");
        if (!res.ok) throw new Error("Fetch brands failed");

        const rawData = await res.json();

        // MAP DATA BACKEND → FRONTEND
        const mappedData: Brand[] = rawData.map((b: any) => ({
          id: b.brandId,
          name: b.name,
        }));

        setBrands(mappedData);
      } catch (err) {
        console.error(err);
        alert("Không tải được danh sách thương hiệu");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const filteredBrands = brands.filter(
    (b) =>
      b.name &&
      b.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );


  const handleRowClick = (id: string) => {
    navigate(`/admin/brands/update/${id}`);
  };

  const handleAddNew = () => {
    navigate("/admin/brands/create");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className={styles["main-content"]}>
      {/* Search */}
      <div className={styles["search-bar"]}>
        <input
          type="text"
          placeholder="Tìm kiếm thương hiệu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Title */}
      <div className={styles.Title}>
        <h1>QUẢN LÝ THƯƠNG HIỆU</h1>
      </div>

      {/* Actions */}
      <div className={styles["add-button"]}>
        <button className={styles["filter-btn"]}>
          Tất cả ({filteredBrands.length})
        </button>
        <button className={styles["add"]} onClick={handleAddNew}>
          Thêm mới <span className={styles["plus-sign"]}>+</span>
        </button>
      </div>

      {/* Table */}
      <section className={styles["table-container"]}>
        <table className={styles["product-table"]}>
          <thead>
            <tr>
              <th>Mã thương hiệu</th>
              <th>Tên thương hiệu</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((item) => (
              <tr key={item.id} onClick={() => handleRowClick(item.id)}>
                <td>{item.id}</td>
                <td>{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBrands.length === 0 && (
          <p style={{ padding: 16 }}>Không có thương hiệu nào</p>
        )}
      </section>
    </main>
  );
};

export default BrandManagement;
