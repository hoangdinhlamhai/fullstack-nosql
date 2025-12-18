import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./update_delete_category.module.css";

/* ===== DTO FRONTEND ===== */
interface Category {
  categoryId: string;
  categoryName: string;
}

const DanhMucEdit: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ===== FETCH DETAIL ===== */
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/categories/${categoryId}`
        );

        if (!res.ok) {
          throw new Error("Không tìm thấy danh mục");
        }

        const data = await res.json();

        setCategory({
          categoryId: data.categoryId,
          categoryName: data.categoryName,
        });
        setCategoryName(data.categoryName);
      } catch (error) {
        console.error(error);
        alert("Không tải được dữ liệu danh mục");
        navigate("/admin/category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, navigate]);

  /* ===== UPDATE ===== */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Tên danh mục không được để trống");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/categories/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryName: categoryName.trim(), // 👈 TRÙNG DTO BE
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Cập nhật thất bại");
      }

      alert("Cập nhật danh mục thành công!");
      navigate("/admin/category");
    } catch (error) {
      console.error(error);
      alert("Cập nhật danh mục thất bại!");
    }
  };

  /* ===== DELETE ===== */
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Xóa thất bại");
      }

      alert("Đã xóa danh mục!");
      navigate("/admin/category");
    } catch (error) {
      console.error(error);
      alert("Xóa danh mục thất bại!");
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>⏳ Đang tải dữ liệu...</p>;
  }

  if (!category) return null;

  return (
    <main className={styles["main-content"]}>
      <h1>Quản lý danh mục</h1>

      <div className={styles["form-section"]}>
        <form onSubmit={handleUpdate}>
          <div>
            <label>Tên danh mục</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
              onClick={() => setShowDelete(true)}
            >
              Xóa
            </button>
          </div>
        </form>
      </div>

      {/* ===== DELETE MODAL ===== */}
      {showDelete && (
        <div className={styles.deleteModal}>
          <div className={styles.modal}>
            <div className={styles["modal-header"]}>
              <h2>Xác nhận xóa</h2>
              <span
                className={styles.close}
                onClick={() => setShowDelete(false)}
              >
                ✕
              </span>
            </div>

            <div className={styles["modal-body"]}>
              <p>
                Bạn có chắc chắn muốn xóa danh mục{" "}
                <strong>{categoryName}</strong>?
              </p>
              <p className={styles.note}>
                Hành động này không thể hoàn tác!
              </p>
            </div>

            <div className={styles["modal-footer"]}>
              <button
                className={styles.cancel}
                onClick={() => setShowDelete(false)}
              >
                Hủy
              </button>

              <button
                className={styles.delete}
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DanhMucEdit;
