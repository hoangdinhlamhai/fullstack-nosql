import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./add_brand.module.css";

const SupplierForm: React.FC = () => {
  const navigate = useNavigate();
  const [tenNCC, setTenNCC] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!tenNCC.trim()) {
      alert("Vui lòng nhập tên thương hiệu!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tenNCC,
        }),
      });

      if (!res.ok) {
        throw new Error("Create brands failed");
      }

      const data = await res.json();
      console.log("Tạo thương hiệu thành công:", data);
      alert("Thêm thương hiệu thành công!");
      navigate("/admin/brands"); // quay về list
    } catch (error) {
      console.error(error);
      alert("Thêm thương hiệu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.mainContent}>
      <h1>Quản lí thương hiệu</h1>

      <div className={styles.formSection}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="supplier-name">Tên thương hiệu</label>
            <input
              id="supplier-name"
              type="text"
              value={tenNCC}
              onChange={(e) => setTenNCC(e.target.value)}
              placeholder="Tên thương hiệu..."
              disabled={loading}
              required
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.add} disabled={loading}>
              {loading ? "Đang lưu..." : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SupplierForm;
