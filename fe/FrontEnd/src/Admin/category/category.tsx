import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./category.module.css";

interface DanhMuc {
  categoryId: string;
  categoryName: string;
}


const DanhMucPage: React.FC = () => {
  const navigate = useNavigate();

  const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===== FETCH CATEGORY ===== */
  useEffect(() => {
    const fetchDanhMucs = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/categories");

        if (!res.ok) {
          throw new Error(`Lỗi tải danh mục (${res.status})`);
        }

        const data: DanhMuc[] = await res.json();
        setDanhMucs(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Không thể tải danh sách danh mục");
      } finally {
        setLoading(false);
      }
    };

    fetchDanhMucs();
  }, []);

  const filteredDanhMucs = useMemo(
    () =>
      danhMucs.filter((dm) =>
        dm.categoryName
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search, danhMucs]
  );


  const handleRowClick = (categoryId: string) => {
    navigate(`/admin/category/edit/${categoryId}`);
  };

  const handleAddNew = () => {
    navigate("/admin/category/create");
  };

  // if (loading) {
  //   return <p style={{ padding: 20 }}>⏳ Đang tải danh mục...</p>;
  // }

  return (
    <main className={styles["main-content"]}>
      <div className={styles["search-bar"]}>
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.Title}>
        <h1>QUẢN LÝ DANH MỤC</h1>
      </div>

      <div className={styles["add-button"]}>
        <button className={styles["filter-btn"]}>
          Tất cả ({filteredDanhMucs.length})
        </button>
        <button className={styles.add} onClick={handleAddNew}>
          Thêm mới <span className={styles["plus-sign"]}>+</span>
        </button>
      </div>

      {error && <div className={styles["alert-danger"]}>{error}</div>}

      <section className={styles["table-container"]}>
        <table className={styles["product-table"]}>
          <thead>
            <tr>
              <th>Mã danh mục</th>
              <th>Tên danh mục</th>
            </tr>
          </thead>
          <tbody>
            {filteredDanhMucs.map((dm) => (
              <tr key={dm.categoryId} onClick={() => handleRowClick(dm.categoryId)}>
                <td>{dm.categoryId}</td>
                <td>{dm.categoryName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default DanhMucPage;
