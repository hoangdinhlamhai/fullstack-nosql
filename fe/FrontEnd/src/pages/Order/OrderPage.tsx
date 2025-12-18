import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./OrderPage.css";
import orderDetailService from "../../services/OrderDetailService";
import { getProductById } from "../../api/productApi";

import paymentService from "../../services/PaymentService";
import type { IProduct } from "../../services/Interface";

interface OrderDetailItem {
  id: string;
  quantity: number;
  product: IProduct;
}

interface OrderProductView {
  productId: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

const OrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const [orderDetails, setOrderDetails] = useState<OrderDetailItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const loadOrder = async () => {
      try {
        const details = await orderDetailService.getByOrderId(String(orderId));

        const items: OrderDetailItem[] = await Promise.all(
          details.map(async (d) => {
            const product = await getProductById(d.productId);

            return {
              id: d.id ?? d.productId,
              quantity: d.quantity,
              product
            };
          })
        );

        setOrderDetails(items);
      } catch (err) {
        console.error(err);
        alert("Không thể tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handlePayPalPayment = async () => {
    if (!orderId) return;

    try {
      const res = await paymentService.createPayPalPayment(String(orderId));

      if (res.approvalUrl) {
        window.location.href = res.approvalUrl;
      } else {
        alert("Không lấy được link PayPal");
      }
    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại");
    }
  };

  const summary = useMemo(() => {
    const subtotal = orderDetails.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );


    return {
      quantity: orderDetails.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      shipping: 0,
      total: subtotal ,
    };
  }, [orderDetails]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  if (loading) return <div className="loading">Đang tải đơn hàng...</div>;

  return (
  <div className="order-page">
    <div className="order-layout">
      {/* ===== LEFT: PRODUCT LIST ===== */}
      <div className="order-left">
        <h2 className="block-title">Sản phẩm trong đơn</h2>

        {orderDetails.map((item) => {
          const lineTotal = item.product.price * item.quantity;

          return (
            <div key={item.id} className="order-item">
              <img
                src={item.product.productImages?.[0]?.url || "/placeholder.png"}
                alt={item.product.name}
                className="order-item-image"
              />

              <div className="order-item-info">
                <h4 className="order-item-name">{item.product.name}</h4>
                <p className="order-item-price">
                  {formatPrice(item.product.price)} × {item.quantity}
                </p>
              </div>

              <div className="order-item-total">
                {formatPrice(lineTotal)}
              </div>
            </div>
          );
        })}

        {/* ===== CUSTOMER INFO ===== */}
        <div className="customer-section">
          <h3 className="block-title">Thông tin khách hàng</h3>
          <div className="customer-box">
            <p>Chưa có thông tin khách hàng</p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT: SUMMARY ===== */}
      <div className="order-right">
        <h2 className="block-title">Tóm tắt đơn hàng</h2>

        <div className="summary-box">
          <div className="summary-row">
            <span>Số lượng sản phẩm</span>
            <span>{summary.quantity}</span>
          </div>

          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{formatPrice(summary.subtotal)}</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-row total">
            <span>Tổng thanh toán</span>
            <span>{formatPrice(summary.total)}</span>
          </div>

          <button
            className="pay-button"
            onClick={handlePayPalPayment}
          >
            Thanh toán PayPal
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default OrderPage;