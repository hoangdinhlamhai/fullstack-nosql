import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./add_category.module.css";

const DanhMucForm: React.FC = () => {
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryName.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName: categoryName.trim(), // 👈 TRÙNG DTO BE
        }),
      });

      if (!res.ok) {
        throw new Error(`Tạo danh mục thất bại (${res.status})`);
      }

      alert("Thêm danh mục thành công!");
      navigate("/admin/category");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles["main-content"]}>
      <h1>Quản lý danh mục</h1>

      <div className={styles["form-section"]}>
        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Tên danh mục
            </label>
            <input
              className={styles["form-input"]}
              type="text"
              placeholder="Nhập tên danh mục..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className={styles["error-message"]}>
              {error}
            </div>
          )}

          <div className={styles["buttons"]}>
            <button
              type="submit"
              className={styles.add}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Thêm mới"}
            </button>

            <button
              type="button"
              className={styles.cancel}
              onClick={() => navigate("/admin/category")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default DanhMucForm;
