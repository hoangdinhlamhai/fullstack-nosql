import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./update_delete_brand.module.css";

interface Brand {
  id: string;
  name: string;
}

const BrandEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ===== FETCH BRAND DETAIL ===== */
  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/brands/${id}`);
        if (!res.ok) throw new Error("Fetch brand failed");

        const data = await res.json();

        setBrand({
          id: data.brandId,
          name: data.name ?? "",
        });

        setBrandName(data.name ?? "");
      } catch (err) {
        console.error(err);
        alert("Không tải được thương hiệu");
      }
    };

    fetchDetail();
  }, [id]);

  /* ===== UPDATE ===== */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!brandName.trim()) {
      alert("Tên thương hiệu không được để trống");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/brands/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: brandName.trim(), // 👈 đúng field BrandDTO
        }),
      });

      if (!res.ok) {
        throw new Error("Update brand failed");
      }

      alert("Cập nhật thương hiệu thành công!");
      navigate("/admin/brands");
    } catch (error) {
      console.error(error);
      alert("Cập nhật thương hiệu thất bại!");
    }
  };

  /* ===== DELETE ===== */
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/brands/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete brand failed");
      }

      alert("Đã xóa thương hiệu!");
      navigate("/admin/brands");
    } catch (error) {
      console.error(error);
      alert("Xóa thương hiệu thất bại!");
    }
  };

  if (!brand) return <p>Loading...</p>;

  return (
    <main className={styles["main-content"]}>
      <h1>Quản lý thương hiệu</h1>

      <div className={styles["form-section"]}>
        <form onSubmit={handleUpdate}>
          <div>
            <label>Tên thương hiệu</label>
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.update}>
              Cập nhật
            </button>
            <button
              type="button"
              className={styles.delete}
              onClick={() => setShowDeleteModal(true)}
            >
              Xóa
            </button>
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <div className={styles.deleteModal}>
          <div className={styles.modal}>
            <p>
              Bạn có chắc chắn muốn xóa <b>{brandName}</b>?
            </p>
            <button onClick={handleDelete}>Xóa</button>
            <button onClick={() => setShowDeleteModal(false)}>Hủy</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default BrandEditPage;
