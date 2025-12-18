/* ===== giữ nguyên import ===== */
import React, { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./update_delete_product.module.css";

/* ===== DTOs ===== */
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
  id?: string;
  url: string;
  img_index: number;
}

interface ProductDTO {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
  brandId: string;
  categoryId: string;
  specification: SpecificationDTO;
  productImages: ProductImageDTO[];
}

/* ===== FORM ===== */
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

const ProductUpdateDeletePage: React.FC = () => {
  const { idProduct } = useParams<{ idProduct: string }>();
  const navigate = useNavigate();

  const [brands, setBrands] = useState<BrandDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);

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

  const [oldImages, setOldImages] = useState<ProductImageDTO[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    if (!idProduct) return;

    const fetchData = async () => {
      try {
        const [b, c, p] = await Promise.all([
          fetch("http://localhost:8080/api/brands"),
          fetch("http://localhost:8080/api/categories"),
          fetch(`http://localhost:8080/api/products/${idProduct}`),
        ]);

        const product: ProductDTO = await p.json();

        setBrands(await b.json());
        setCategories(await c.json());

        setForm({
          name: product.name,
          price: String(product.price),
          stockQuantity: String(product.stockQuantity),
          description: product.description,
          brandId: product.brandId,
          categoryId: product.categoryId,
          screen: product.specification.screen,
          cpu: product.specification.cpu,
          ram: product.specification.ram,
          storage: product.specification.storage,
          camera: product.specification.camera,
          battery: product.specification.battery,
          os: product.specification.os,
          images: [],
        });

        setOldImages(product.productImages ?? []);
      } catch {
        alert("Không tải được sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idProduct]);

  /* ===== HANDLERS ===== */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setForm((p) => ({ ...p, images: files }));

    previews.forEach(URL.revokeObjectURL);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const canSubmit = useMemo(
    () => form.name && form.price && form.stockQuantity,
    [form]
  );

  /* ===== UPLOAD IMAGE ===== */
  const uploadImages = async (files: File[]) =>
    Promise.all(
      files.map(async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("http://localhost:8080/api/images/img-upload", {
          method: "POST",
          body: fd,
        });
        return res.text();
      })
    );

  /* ===== UPDATE ===== */
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!idProduct) return;

    let imagesPayload = oldImages;

    if (form.images.length) {
      const urls = await uploadImages(form.images);
      imagesPayload = urls.map((u, i) => ({ url: u, img_index: i }));
    }

    const payload: ProductDTO = {
      productId: idProduct,
      name: form.name,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      description: form.description,
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
      productImages: imagesPayload,
    };

    await fetch(`http://localhost:8080/api/products/${idProduct}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    navigate("/admin/products");
  };

  /* ===== DELETE ===== */
  const handleDelete = async () => {
    await fetch(`http://localhost:8080/api/products/${idProduct}`, {
      method: "DELETE",
    });
    navigate("/admin/products");
  };

  if (loading) return <p>Loading...</p>;

  /* ===== RENDER ===== */
  return (
    <main className={styles["main-content"]}>
      <div className={styles["form-section"]}>
        <h1>Cập nhật / Xóa sản phẩm</h1>

        {/* {metaLoading && <p>Đang tải danh mục / thương hiệu...</p>} */}

        <form onSubmit={handleUpdate}>
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
          <h3>Hình ảnh hiện tại</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {oldImages.map((img) => (
              <img
                key={img.id}
                src={img.url}
                width={100}
                height={100}
                style={{ objectFit: "cover", borderRadius: 6 }}
              />
            ))}
          </div>

          <h3 style={{ marginTop: 16 }}>Chọn ảnh mới (nếu muốn thay)</h3>
          <input type="file" multiple accept="image/*" onChange={handleFilesChange} />

          {previews.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              {previews.map((src, i) => (
                <img key={i} src={src} width={100} height={100} />
              ))}
            </div>
          )}

          <div className={styles.buttons}>
          <button type="submit" disabled={!canSubmit}>Cập nhật</button>
          <button type="button" onClick={() => setShowDeleteModal(true)}>Xóa</button>
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Bạn chắc chắn muốn xóa sản phẩm này?</p>
            <button onClick={handleDelete}>Xóa luôn</button>
            <button onClick={() => setShowDeleteModal(false)}>Hủy</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductUpdateDeletePage;
