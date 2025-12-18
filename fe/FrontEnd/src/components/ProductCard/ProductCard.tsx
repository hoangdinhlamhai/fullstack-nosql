import React from "react";
import "./ProductCard.css";
import type { IProduct } from "../../services/Interface";
import { useNavigate } from "react-router-dom";
import { getCartByUserId } from "../../api/cartApi";
import { addCartDetail } from "../../api/cartDetailApi";

const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/product-detail/${product.productId}`); // ĐÃ SỬA ĐÚNG ID
  };

  // Lấy ảnh đầu tiên trong productImages
  const imageUrl =
    product.productImages?.length > 0
      ? product.productImages[0].url
      : "/placeholder-image.jpg";

    const handleBuyNow = async (e: React.MouseEvent) => {
      e.stopPropagation();

      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");

        if (!user.userId) {
          alert("Vui lòng đăng nhập");
          navigate("/login");
          return;
        }

        // 1️⃣ lấy cart theo userId
        const cart = await getCartByUserId(user.userId);

        // 2️⃣ thêm sản phẩm vào cart (CHỈ 2 ID)
        await addCartDetail(cart.cartId, product.productId);
        navigate("/cartShop");
        alert("Đã thêm vào giỏ hàng!");
      } catch (err) {
        alert("Thêm vào giỏ hàng thất bại");
        console.error(err);
      }
    };


  return (
    <div
      className="product-card-wrapper"
      data-installment="Trả góp 0%"
      onClick={handleViewDetail}
    >
      <div className="product-card">
        {/* Hình ảnh */}
        <div className="product-thumb">
          <img
            src={imageUrl || "/placeholder-image.jpg"}
            alt={product.name}
            className="product-img"
            loading="lazy"
          />
        </div>

        {/* Nội dung */}
        <div className="product-body">
          <div className="product-name">{product.name}</div>
          <p className="product-desc">{product.description}</p>

          <div className="product-info">
            <p className="product-stock">
              Còn lại: <span>{product.stockQuantity}</span>
            </p>
          </div>

          <div className="product-price">
            {product.price.toLocaleString("vi-VN")} ₫
          </div>

          <div className="product-actions">
            <button
              onClick={handleBuyNow}
              className="btn-buy"
            >
              Mua ngay
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetail();
              }}
              className="btn-detail"
            >
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;