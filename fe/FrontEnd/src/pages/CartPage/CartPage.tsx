import React, { useState, useEffect } from "react";
import type { IProduct } from "../../services/Interface";
import type { IUser } from "../../services/Interface";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";
import { getCartByUserId } from "../../api/cartApi";
import { getAllCartDetails } from "../../api/cartDetailApi";
import { getProductById } from "../../api/productApi";
import { addCartDetail, deleteOneCartDetailByProductId, deleteAllCartDetailsByProductId } from "../../api/cartDetailApi";
import { createOrder } from "../../api/orderApi";
import { createOrderDetail } from "../../api/orderDetailApi";

interface CartItem extends IProduct {
  quantity: number;
}

const CartPage: React.FC = () => {
  const currentUser: IUser | null = {
    userID: 1,
    fullName: "Nguyễn Văn A",
    sdt: "0901234567",
    email: "nguyenvana@gmail.com",
    address: "123 Đường Láng, Hà Nội",
    roleId: 1,
  };

  const navigate = useNavigate();
  const [cartId, setCartId] = useState<string>("");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        if (!user.userId) return;

        // 1️⃣ lấy cart
        const cart = await getCartByUserId(user.userId);
        setCartId(cart.cartId);
        // 2️⃣ lấy all cart details
        const cartDetails = await getAllCartDetails();

        // 3️⃣ lọc theo cartId
        const myCartDetails = cartDetails.filter(
          (cd: any) => cd.cartId === cart.cartId
        );

        // 4️⃣ group theo productId
        const productCountMap: Record<string, number> = {};
        myCartDetails.forEach((cd: any) => {
          productCountMap[cd.productId] =
            (productCountMap[cd.productId] || 0) + 1;
        });

        // 5️⃣ lấy info product
        const items: CartItem[] = await Promise.all(
          Object.entries(productCountMap).map(
            async ([productId, quantity]) => {
              const product = await getProductById(productId);

              return {
                ...product,
                quantity
              };
            }
          )
        );

        setCartItems(items);
      } catch (err) {
        console.error("Load cart failed", err);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (productId: string, delta: number) => {
    try {
      // ➕ tăng
      if (delta === 1) {
        await addCartDetail(cartId, productId);

        setCartItems(prev =>
          prev.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
        return;
      }

      // ➖ giảm
      if (delta === -1) {
        const currentItem = cartItems.find(
          item => item.productId === productId
        );
        if (!currentItem) return;

        // quantity > 1 → xoá 1 row
        if (currentItem.quantity > 1) {
          await deleteOneCartDetailByProductId(productId);

          setCartItems(prev =>
            prev.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          );
        } else {
          // quantity === 1 → xoá item
          await deleteOneCartDetailByProductId(productId);

          setCartItems(prev =>
            prev.filter(item => item.productId !== productId)
          );
        }
      }
    } catch (err) {
      console.error("Update quantity failed", err);
    }
  };



  const removeItem = async (productId: string) => {
    try {
      // 1️⃣ xoá toàn bộ cartDetails trong DB
      await deleteAllCartDetailsByProductId(productId);

      // 2️⃣ update UI
      setCartItems(prev =>
        prev.filter(item => item.productId !== productId)
      );
    } catch (err) {
      console.error("Remove item failed", err);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");

      if (!user.userId) {
        alert("Vui lòng đăng nhập");
        navigate("/login");
        return;
      }

      if (cartItems.length === 0) {
        alert("Giỏ hàng trống");
        return;
      }

      /* ================= 1️⃣ CREATE ORDER ================= */
      const order = await createOrder({
        userId: user.userId,
        status: "PENDING",
        paymentStatus: "UNPAID",
        orderDate: new Date().toISOString()
      });

      const orderId = order.orderId;

      /* ================= 2️⃣ CREATE ORDER DETAILS ================= */
      for (const item of cartItems) {
        await createOrderDetail({
          orderId: orderId,
          productId: item.productId,
          quantity: item.quantity
        });
      }

      /* ================= 3️⃣ REDIRECT ================= */
      alert("🎉 Đặt hàng thành công");
      navigate(`/order/${orderId}`);
    } catch (err) {
      console.error(err);
      alert("Đặt hàng thất bại");
    }
  };


  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-left">
          <div className="cart-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              Quay lại
            </button>
            <h1>Giỏ hàng</h1>
          </div>

          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">
              <img
                src={item.productImages?.[0]?.url || "/no-image.png"}
                alt={item.name}
                className="item-img"
                onClick={() => navigate(`/product-detail/${item.productId}`)}
              />


              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-variant">{item.description}</div>

                <div className="quantity-and-price">
                  <div className="quantity-box">
                    <button onClick={() => updateQuantity(item.productId, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)}>+</button>
                  </div>

                  <div className="price-wrapper">
                    <span className="current-price">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </span>
                    {item.quantity > 1 && (
                      <div className="total-for-item">
                        = {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="remove-item-btn fa-solid fa-trash"
                onClick={() => removeItem(item.productId)}
                title="Xóa sản phẩm"
              >
              </button>
            </div>
          ))}


          {/* Tổng tiền */}
          <div className="cart-total">
            <div className="total-row">
              <span>Tổng giá trị:</span>
              <strong>{totalPrice.toLocaleString("vi-VN")} ₫</strong>
            </div>
            <div className="total-row final">
              <span>Tổng thanh toán:</span>
              <strong>{totalPrice.toLocaleString("vi-VN")} ₫</strong>
            </div>
          </div>
        </div>

        <div className="cart-right">
          <h2>Thông tin đặt hàng</h2>
          <p className="note">Bạn cần nhập đầy đủ các trường thông tin có dấu *</p>

          <form className="checkout-form">
            <input type="text" placeholder="Họ và tên *" defaultValue={currentUser?.fullName || ""} required />
            <input type="text" placeholder="Số điện thoại *" defaultValue={currentUser?.sdt || ""} required />
            <input type="email" placeholder="Email" defaultValue={currentUser?.email || ""} />


            <div className="address-row">
              <select required>
                <option value="">Tỉnh/Thành phố *</option>
                <option>Hà Nội</option>
              </select>
              <select required>
                <option value="">Cửa hàng *</option>
                <option>FPT Shop Cầu Giấy</option>
              </select>
            </div>

            <textarea placeholder="Ghi chú (ví dụ: giao giờ hành chính)"></textarea>

            <button
              type="button"
              className="btn-confirm"
              onClick={handleConfirmOrder}
            >
              XÁC NHẬN VÀ ĐẶT HÀNG
            </button>

            <p className="policy">
              Quý khách có thể lựa chọn hình thức thanh toán sau khi đặt hàng.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CartPage;