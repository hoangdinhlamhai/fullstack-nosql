import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getOrdersByUser } from "../../api/orderApi";
import { getOrderDetailsByOrderId } from "../../api/orderDetailApi";
import { getProductById } from "../../api/productApi";

import type { IOrder, IOrderDetail, IProduct } from "../../services/Interface";
import "./OrderHistoryPage.css";

/* ===== TYPES ===== */
interface OrderDetailWithProduct extends IOrderDetail {
  product: IProduct;
  lineTotal: number;
}

/* ===== UTILS ===== */
const getUserFromSession = () => {
  const data = sessionStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
    case "Hoàn thành":
      return "#00c853";
    case "DELIVERED":
    case "Đã giao":
      return "#0066cc";
    case "PENDING":
    case "Đang xử lý":
      return "#ff9800";
    case "CANCELLED":
    case "Đã hủy":
      return "#d70018";
    default:
      return "#666";
  }
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  /* ===== AUTH ===== */
  const user = getUserFromSession();
  const userId: string | undefined = user?.userId;

  /* ===== STATE ===== */
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailWithProduct[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===== LOAD ORDERS ===== */
  useEffect(() => {
    if (!userId) {
      setOrders([]);
      return;
    }

    getOrdersByUser(userId)
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => setOrders([]));
  }, [userId]);

  /* ===== LOAD ORDER DETAILS ===== */
  const handleSelectOrder = async (order: IOrder) => {
    setSelectedOrder(order);
    setOrderDetails([]);
    setLoading(true);

    try {
      const details = await getOrderDetailsByOrderId(order.orderId);

      const full: OrderDetailWithProduct[] = await Promise.all(
        details.map(async (d) => {
          const product = await getProductById(d.productId);
          return {
            ...d,
            product,
            lineTotal: product.price * d.quantity,
          };
        })
      );

      setOrderDetails(full);
    } catch {
      setOrderDetails([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===== TOTAL ===== */
  const totalAmount = orderDetails.reduce(
    (sum, i) => sum + i.lineTotal,
    0
  );

  /* ===== PREVIEW TEXT ===== */
  const getPreviewText = (orderId: string) => {
    if (selectedOrder?.orderId === orderId && orderDetails.length > 0) {
      if (orderDetails.length === 1) return orderDetails[0].product.name;
      return `${orderDetails[0].product.name} và ${orderDetails.length - 1
        } sản phẩm khác`;
    }
    return "Nhấn để xem chi tiết đơn hàng";
  };

  /* ===== RENDER ===== */
  return (
    <div className="order-history-page">
      <div className="order-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Quay lại
        </button>

        <h1 className="page-title">Lịch sử đơn hàng</h1>

        <div className="orders-grid">
          {/* ===== LEFT ===== */}
          <div className="orders-list">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className={`order-card ${selectedOrder?.orderId === order.orderId ? "active" : ""
                  }`}
                onClick={() => handleSelectOrder(order)}
              >
                <div className="order-header">
                  <div>
    <div className="order-id">
      Đơn hàng #{order.orderId}
    </div>

   
    <div className="order-customer">
      Tên khách hàng : {user?.fullName || user?.sdt}
    </div>

    <div className="order-date">
      {new Date(order.orderDate).toLocaleString("vi-VN")}
    </div>
  </div>

  <div className={`order-status ${order.status}`}>
    {order.status}
  </div>
                </div>

                <div className="order-items-preview-text">
                  {getPreviewText(order.orderId)}
                </div>
              </div>
            ))}
          </div>

          {/* ===== RIGHT ===== */}
          <div className="order-detail-panel">
            {loading && <p>Đang tải chi tiết...</p>}

            {!loading && selectedOrder && (
              <>
                <h2>Chi tiết đơn hàng #{selectedOrder.orderId}</h2>

                <div className="detail-info">
                  <p>
                    <strong>Ngày đặt:</strong>{" "}
                    {formatDate(selectedOrder.orderDate)}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    <span
                      style={{
                        color: getStatusColor(selectedOrder.status),
                      }}
                    >
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>

                <div className="detail-products">
                  {orderDetails.map((item) => (
                    <div key={item.id} className="detail-item">
                      <img
                        src={
                          item.product.productImages?.[0]?.url ||
                          "/placeholder.png"
                        }
                        alt={item.product.name}
                      />
                      <div className="detail-item-info">
                        <h4>{item.product.name}</h4>
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                      <div className="detail-price">
                        {item.lineTotal.toLocaleString("vi-VN")} ₫
                      </div>
                    </div>
                  ))}
                </div>

                <div className="detail-total">
                  <strong>Tổng thanh toán:</strong>
                  <span className="final-price">
                    {totalAmount.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </>
            )}

            {!selectedOrder && !loading && (
              <div className="no-order-selected">
                <p>Chọn một đơn hàng để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
