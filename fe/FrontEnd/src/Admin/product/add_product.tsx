import React, { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./add_product.module.css";

/* ===== BE DTOs ===== */
interface BrandDTO {
  brandId: string;
  name: string;
}

interface CategoryDTO {
  categoryId: string;
  categoryName: string;
}

interface SpecificationDTO {
  screen: string;
  cpu: string;
  ram: string;
  storage: string;
  camera: string;
  battery: string;
  os: string;
}

interface ProductImageDTO {
  url: string;
  imgIndex: number;
}

interface ProductCreatePayload {
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
  brandId: string;
  categoryId: string;
  specification: SpecificationDTO;
  productImages: ProductImageDTO[];
}

/* ===== FORM MODEL ===== */
interface ProductForm {
  name: string;
  price: string;
  stockQuantity: string;
  description: string;
  brandId: string;
  categoryId: string;

  screen: string;
  cpu: string;
  ram: string;
  storage: string;
  camera: string;
  battery: string;
  os: string;

  images: File[];
}

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState<BrandDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);

  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: "",
    stockQuantity: "",
    description: "",
    brandId: "",
    categoryId: "",

    screen: "",
    cpu: "",
    ram: "",
    storage: "",
    camera: "",
    battery: "",
    os: "",

    images: [],
  });

  const [previews, setPreviews] = useState<string[]>([]);

  /* ===== FETCH BRAND + CATEGORY ===== */
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          fetch("http://localhost:8080/api/brands"),
          fetch("http://localhost:8080/api/categories"),
        ]);

        if (!brandRes.ok || !categoryRes.ok) {
          throw new Error("Không tải được brand / category");
        }

        setBrands(await brandRes.json());
        setCategories(await categoryRes.json());
      } catch (err) {
        console.error("❌ FETCH META ERROR:", err);
      } finally {
        setMetaLoading(false);
      }
    };

    fetchMeta();
  }, []);

  /* ===== CLEANUP PREVIEW URL ===== */
  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  /* ===== VALIDATE SUBMIT ===== */
  const canSubmit = useMemo(() => {
    return (
      form.name.trim() &&
      form.brandId &&
      form.categoryId &&
      form.price &&
      form.stockQuantity &&
      form.screen.trim() &&
      form.cpu.trim() &&
      form.ram.trim() &&
      form.storage.trim() &&
      form.camera.trim() &&
      form.battery.trim() &&
      form.os.trim() &&
      form.images.length > 0
    );
  }, [form]);

  /* ===== HANDLERS ===== */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    previews.forEach((u) => URL.revokeObjectURL(u));
    setPreviews(files.map((f) => URL.createObjectURL(f)));
    setForm((prev) => ({ ...prev, images: files }));
  };

  /* ===== UPLOAD IMAGES (PARALLEL) ===== */
  const uploadImagesToCloudinary = async (files: File[]) => {
    const uploads = files.map((file) => {
      const fd = new FormData();
      fd.append("file", file);

      return fetch("http://localhost:8080/api/images/img-upload", {
        method: "POST",
        body: fd,
      }).then((res) => {
        if (!res.ok) throw new Error("Upload ảnh thất bại");
        return res.text();
      });
    });

    return Promise.all(uploads); // string[]
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!canSubmit) {
        alert("Vui lòng nhập đủ thông tin & chọn ảnh");
        return;
      }

      // 1️⃣ upload ảnh
      const imageUrls = await uploadImagesToCloudinary(form.images);

      // 2️⃣ build payload
      const payload: ProductCreatePayload = {
        name: form.name.trim(),
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        description: form.description.trim(),
        brandId: form.brandId,
        categoryId: form.categoryId,

        specification: {
          screen: form.screen,
          cpu: form.cpu,
          ram: form.ram,
          storage: form.storage,
          camera: form.camera,
          battery: form.battery,
          os: form.os,
        },

        productImages: imageUrls.map((url, idx) => ({
          url,
          imgIndex: idx,
        }))

      };

      console.log("CREATE PRODUCT PAYLOAD:", payload);

      // 3️⃣ create product
      const res = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create product failed");
      }

      alert("Tạo sản phẩm thành công");
      navigate("/admin/products");
    } catch (err: any) {
      console.error("CREATE ERROR:", err);
      alert(err.message || "Tạo sản phẩm thất bại");
    }
  };

  return (
    <main className={styles["main-content"]}>
      <div className={styles["form-section"]}>
        <h1>Thêm sản phẩm</h1>

        {metaLoading && <p>Đang tải danh mục / thương hiệu...</p>}

        <form onSubmit={handleSubmit}>
          {/* ===== basic fields ===== */}
          <div>
            <label htmlFor="name">Tên sản phẩm</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              placeholder="Tên sản phẩm..."
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="categoryId">Danh mục</label>
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn danh mục --</option>

              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="brandId">Thương hiệu</label>
            <select
              id="brandId"
              name="brandId"
              value={form.brandId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map((b) => (
                <option key={b.brandId} value={b.brandId}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price">Đơn giá</label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              placeholder="Ví dụ: 32990000"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="stockQuantity">Số lượng</label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={form.stockQuantity}
              placeholder="Ví dụ: 20"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              placeholder="Mô tả..."
              rows={4}
              onChange={handleChange}
            />
          </div>

          {/* ===== specification ===== */}
          <h3 style={{ marginTop: 16 }}>Cấu hình</h3>

          <div>
            <label htmlFor="screen">Màn hình</label>
            <input
              type="text"
              id="screen"
              name="screen"
              value={form.screen}
              placeholder='Ví dụ: 6.7 inch OLED'
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="cpu">CPU</label>
            <input
              type="text"
              id="cpu"
              name="cpu"
              value={form.cpu}
              placeholder="Ví dụ: A18 Pro"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="ram">RAM</label>
            <input
              type="text"
              id="ram"
              name="ram"
              value={form.ram}
              placeholder="Ví dụ: 8GB"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="storage">Bộ nhớ</label>
            <input
              type="text"
              id="storage"
              name="storage"
              value={form.storage}
              placeholder="Ví dụ: 256GB"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="camera">Camera</label>
            <input
              type="text"
              id="camera"
              name="camera"
              value={form.camera}
              placeholder="Ví dụ: 48MP"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="battery">Pin</label>
            <input
              type="text"
              id="battery"
              name="battery"
              value={form.battery}
              placeholder="Ví dụ: 4422mAh"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="os">Hệ điều hành</label>
            <input
              type="text"
              id="os"
              name="os"
              value={form.os}
              placeholder="Ví dụ: iOS 18"
              onChange={handleChange}
              required
            />
          </div>

          {/* ===== images (multi) ===== */}
          <h3 style={{ marginTop: 16 }}>Hình ảnh</h3>

          <div>
            <label>Chọn ảnh (nhiều ảnh)</label>
            <div
              className={styles["image-upload"]}
              onClick={() => document.getElementById("fileInput")?.click()}
              role="button"
              tabIndex={0}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                style={{ display: "none" }}
              />

              {previews.length === 0 ? (
                <img
                  src="https://placehold.co/100x100"
                  alt="preview"
                  width={100}
                  height={100}
                />
              ) : (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {previews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`preview-${idx}`}
                      width={100}
                      height={100}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.add} disabled={!canSubmit}>
              Thêm mới
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProductCreatePage;
