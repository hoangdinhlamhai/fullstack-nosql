import { useState, useEffect } from "react";
import "../DetailProduct/DetailProductPage.css";
import type { IProduct } from '../../services/Interface';
import { useParams } from "react-router-dom";
import { getProductById } from '../../api/productApi';
import { getCartByUserId } from "../../api/cartApi";
import { addCartDetail } from "../../api/cartDetailApi";
import { useNavigate } from "react-router-dom";


export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedStorage, setSelectedStorage] = useState("1TB");
  const [selectedColor, setSelectedColor] = useState("Titan Sa Mạc");
  const [selectedImg, setSelectedImg] = useState<string>("");
  const navigate = useNavigate();

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      if (!user.userId) {
        alert("Vui lòng đăng nhập trước");
        navigate("/login");
        return;
      }

      // 1️⃣ lấy cart theo user
      const cart = await getCartByUserId(user.userId);

      // 2️⃣ thêm cart detail (KHÔNG quantity)
      await addCartDetail(cart.cartId, product.productId);

      // 3️⃣ sang trang giỏ hàng (tuỳ bạn)
      navigate("/cartShop");
    } catch (err) {
      console.error("Buy now failed", err);
      alert("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };


  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const data = await getProductById(id);
        setProduct(data);

        if (data.productImages?.length > 0) {
          setSelectedImg(data.productImages[0].url);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [id]);

  if (!product) return <p>Đang tải...</p>;

  const images = product.productImages || [];

  return (
    <div className="product-container">
      <h1 className="product-title">{product.name}</h1>

      <div className="rating-row">
        <span className="star">★</span>
        <span className="rating">4.9</span>
        <span className="rating-count">(15 đánh giá)</span>
      </div>

      <div className="product-grid">

        <div className="image-box">
          <img src={selectedImg} className="main-img" alt="IP" />

          <div className="thumb-list">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                className="thumb"
                onClick={() => setSelectedImg(img.url)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="detail-box">

          <div className="price-block">
            <div className="price-main">{product.price.toLocaleString("vi-VN")}đ</div>
            {/* <div className="price-old">46.990.000đ</div> */}
          </div>

          {/* Storage options */}
          <h3 className="section-title">Phiên bản</h3>
          <div className="options-row">
            {["1TB", "512GB", "256GB"].map(opt => (
              <button
                key={opt}
                className={
                  selectedStorage === opt
                    ? "option-btn active"
                    : "option-btn"
                }
                onClick={() => setSelectedStorage(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Color options */}
          <h3 className="section-title">Màu sắc</h3>
          <div className="color-grid">
            {["Titan Sa Mạc", "Titan Đen", "Titan Trắng", "Titan Tự Nhiên"].map(
              color => (
                <button
                  key={color}
                  className={
                    selectedColor === color
                      ? "color-btn active"
                      : "color-btn"
                  }
                  onClick={() => setSelectedColor(color)}
                >
                  <img src={selectedImg} className="color-img" />
                  <div className="color-info">
                    <p className="color-name">{color}</p>
                    <p className="color-price">{product.price.toLocaleString("vi-VN")}đ</p>
                  </div>
                </button>
              )
            )}
          </div>

          <div className="action-row">
            <button className="btn blue">Trả góp 0%</button>
            <button className="btn red" onClick={handleBuyNow}>
              Mua Ngay
            </button>

          </div>

          <button className="btn-outline">Liên hệ</button>

        </div>
      </div>

      {/* Feature Box */}
      <div className="feature-box">
        <h2 className="feature-title">TÍNH NĂNG NỔI BẬT</h2>
        <ul className="feature-list">
          <li>Màn hình: {product.specification.screen}</li>
          <li>CPU: {product.specification.cpu}</li>
          <li>RAM: {product.specification.ram}</li>
          <li>Pin: {product.specification.battery}</li>
          <li>Hệ điều hành: {product.specification.os}</li>
        </ul>
      </div>
    </div>
  );
}
