import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./order_approval.module.css";

/* ================= TYPES ================= */
type TrangThai =
  | "Chưa duyệt"
  | "Chờ duyệt"
  | "Đã duyệt"
  | "Đang giao"
  | "Hoàn thành"
  | "Đã từ chối"
  | "Đã hủy";

interface DonHang {
  idDon: string;
  ngayDat?: string;
  tenNguoiNhan: string;
  sdtNguoiNhan: string;
  diaChiNhan: string;
  ghiChu?: string;
  trangThai: TrangThai | string;
}

interface ChiTietDonHang {
  tenSanPham: string;
  donGia: number;
  soLuong: number;
  thanhTien: number;
  hinhAnh?: string | null;
}

interface OrderDetailVM {
  donHang: DonHang;
  chiTietDonHang: ChiTietDonHang[];
  tongTien: number;
  thanhTien: number;
  phuongThucThanhToan: string;
}

type ModalType = "approve" | "reject" | null;

const formatVND = (n: number) =>
  `${Number(n || 0).toLocaleString("vi-VN")}đ`;

/* ================= MAP STATUS ================= */
const mapTrangThai = (status: string): TrangThai => {
  switch (status) {
    case "PENDING":
      return "Chưa duyệt";
    case "APPROVED":
      return "Đã duyệt";
    case "SHIPPING":
      return "Đang giao";
    case "COMPLETED":
      return "Hoàn thành";
    case "REJECTED":
      return "Đã từ chối";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Chưa duyệt";
  }
};

/* ================= COMPONENT ================= */
const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<OrderDetailVM | null>(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");

  /* ================= FETCH API ================= */
  useEffect(() => {
    if (!id) return;

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);

        // 1️⃣ Lấy order
        const orderRes = await fetch(`http://localhost:8080/api/order/${id}`);
        if (!orderRes.ok) throw new Error("Fetch order failed");
        const order = await orderRes.json();

        // 2️⃣ Lấy user từ order.userId
        let userInfo = {
          fullName: "—",
          sdt: "—",
          address: "—",
        };

        if (order.userId) {
          const userRes = await fetch(
            `http://localhost:8080/api/users/${order.userId}`
          );
          if (userRes.ok) {
            const user = await userRes.json();
            userInfo = {
              fullName: user.fullName ?? "—",
              sdt: user.sdt ?? "—",
              address: user.address ?? "—",
            };
          }
        }

        // 3️⃣ Lấy order details
        const detailRes = await fetch(
          `http://localhost:8080/api/order-details/order/${id}`
        );
        if (!detailRes.ok) throw new Error("Fetch order details failed");
        const details = await detailRes.json();

        // 4️⃣ Gắn product
        const items: ChiTietDonHang[] = await Promise.all(
          details.map(async (d: any) => {
            const productRes = await fetch(
              `http://localhost:8080/api/products/${d.productId}`
            );
            const product = await productRes.json();

            const price = Number(product.price || 0);
            const quantity = Number(d.quantity || 0);

            return {
              tenSanPham: product.name,
              donGia: price,
              soLuong: quantity,
              thanhTien: price * quantity,
              hinhAnh: product.productImages?.[0]?.url ?? null,
            };
          })
        );

        // 5️⃣ Tính tiền
        const tongTien = items.reduce((s, i) => s + i.thanhTien, 0);

        // 6️⃣ ViewModel
        setData({
          donHang: {
            idDon: order.orderId,
            ngayDat: order.orderDate,
            tenNguoiNhan: userInfo.fullName,
            sdtNguoiNhan: userInfo.sdt,
            diaChiNhan: userInfo.address,
            ghiChu: order.note ?? "",
            trangThai: mapTrangThai(order.status),
          },
          chiTietDonHang: items,
          tongTien,
          thanhTien: tongTien,
          phuongThucThanhToan: order.paymentMethod ?? "PayPal",
        });
      } catch (err) {
        console.error(err);
        alert("❌ Không tải được chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  /* ================= DERIVED ================= */
  const canApproveReject = useMemo(() => {
    const st = data?.donHang.trangThai;
    return st === "Chưa duyệt" || st === "Chờ duyệt";
  }, [data?.donHang.trangThai]);

  /* ================= MODAL ================= */
  const openApproveModal = () => {
    if (!data) return;
    setModalType("approve");
    setModalTitle("Duyệt đơn hàng");
    setModalMessage(`Bạn có chắc chắn muốn duyệt đơn hàng #${data.donHang.idDon}?`);
    setShowModal(true);
  };

  const openRejectModal = () => {
    if (!data) return;
    setModalType("reject");
    setModalTitle("Từ chối đơn hàng");
    setModalMessage(`Bạn có chắc chắn muốn từ chối đơn hàng #${data.donHang.idDon}?`);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setLyDoTuChoi("");
  };

  const onConfirm = async () => {
    if (!data || !modalType) return;

    try {
      if (modalType === "approve") {
        alert(`✅ Đã duyệt đơn #${data.donHang.idDon}`);
      } else {
        alert(`❌ Đã từ chối đơn #${data.donHang.idDon}\nLý do: ${lyDoTuChoi || "(trống)"}`);
      }
      navigate("/admin/order_approval");
    } finally {
      closeModal();
    }
  };

  const updateOrderStatus = async (newStatus: "APPROVED" | "REJECTED") => {
    if (!data) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/order/${data.donHang.idDon}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!res.ok) throw new Error("Update order status failed");

      // update UI ngay (không cần reload page)
      setData(prev =>
        prev
          ? {
            ...prev,
            donHang: {
              ...prev.donHang,
              trangThai:
                newStatus === "APPROVED"
                  ? "Đã duyệt"
                  : "Đã từ chối",
            },
          }
          : prev
      );

      alert(
        newStatus === "APPROVED"
          ? "✅ Đã duyệt đơn hàng"
          : "❌ Đã từ chối đơn hàng"
      );
    } catch (err) {
      console.error(err);
      alert("❌ Cập nhật trạng thái thất bại");
    }
  };


  if (loading) return <div className={styles.page}>Đang tải dữ liệu...</div>;
  if (!data) return null;

  const { donHang, chiTietDonHang, tongTien, thanhTien, phuongThucThanhToan } = data;

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        {/* HEADER */}
        <div className={styles["order-header"]}>
          <button className={styles["back-btn"]} onClick={() => navigate("/admin/order_approval")}>
            <i className="ri-arrow-left-line" /> Chi tiết đơn hàng
          </button>

          {canApproveReject && (
            <div className={styles["approval-btns"]}>
              <h2>Duyệt đơn hàng:</h2>

              <button
                className={styles["approve-btn"]}
                title="Duyệt đơn"
                onClick={() => updateOrderStatus("APPROVED")}
              >
                <i className="ri-check-line" />
              </button>

              <button
                className={styles["reject-btn"]}
                title="Từ chối đơn"
                onClick={() => updateOrderStatus("REJECTED")}
              >
                <i className="ri-close-line" />
              </button>
            </div>
          )}

        </div>

        <div className={styles.containerInner}>
          {/* INFO */}
          <div className={styles["order-info"]}>
            <Info label="Mã đơn hàng" value={`#${donHang.idDon}`} />
            <Info label="Ngày đặt hàng" value={new Date(donHang.ngayDat || "").toLocaleDateString("vi-VN")} />
            <Info label="Họ tên người nhận" value={donHang.tenNguoiNhan} />
            <Info label="Số điện thoại" value={donHang.sdtNguoiNhan} />
            <Info label="Địa chỉ nhận hàng" value={donHang.diaChiNhan} />
            <Info label="Ghi chú" value={donHang.ghiChu || ""} />
            <Info label="Trạng thái đơn hàng" value={donHang.trangThai} />
          </div>

          {/* PRODUCTS */}
          <div className={styles["products-list"]}>
            {chiTietDonHang.map((item, idx) => (
              <div className={styles["product-item"]} key={idx}>
                <img src={item.hinhAnh || "https://via.placeholder.com/100"} alt="" />
                <div className={styles["product-details"]}>
                  <div className={styles["product-name"]}>{item.tenSanPham}</div>
                  <div className={styles["product-price"]}>{formatVND(item.donGia)}</div>
                  <div className={styles["product-quantity"]}>Số lượng: x {item.soLuong}</div>
                </div>
                <div className={styles["product-total"]}>{formatVND(item.thanhTien)}</div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className={styles["order-summary"]}>
            <Summary label="Tổng tiền hàng" value={tongTien} />
            <div className={styles["summary-row"]}>
              <div>Phương thức thanh toán</div>
              <div>{phuongThucThanhToan}</div>
            </div>
            <div className={`${styles["summary-row"]} ${styles["total-row"]}`}>
              <div>Thành tiền</div>
              <div>{formatVND(thanhTien)}</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <h3>{modalTitle}</h3>
            <p>{modalMessage}</p>

            {modalType === "reject" && (
              <>
                <label>Lý do từ chối:</label>
                <textarea value={lyDoTuChoi} onChange={(e) => setLyDoTuChoi(e.target.value)} />
              </>
            )}

            <div className={styles["modal-buttons"]}>
              <button className={styles["btn-primary"]} onClick={onConfirm}>Xác nhận</button>
              <button className={styles["btn-secondary"]} onClick={closeModal}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles["info-item"]}>
      <div className={styles["info-label"]}>{label}</div>
      <div className={styles["info-value"]}>{value}</div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles["summary-row"]}>
      <div>{label}</div>
      <div>{formatVND(value)}</div>
    </div>
  );
}

export default OrderDetailPage;
