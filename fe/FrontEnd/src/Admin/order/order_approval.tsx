import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./order_approval.module.css";

/* ================= TYPES ================= */
interface DonHang {
  idDon: string;
  ngayDat?: string;
  tenNguoiNhan: string;
  sdtNguoiNhan: string;
  trangThai: string;
}


interface OrderAPI {
  orderId: string;
  orderDate: string;
  status: string;
  paymentStatus: string;
  fullname: string | null;
  sdt: string | null;
}

/* ================= COMPONENT ================= */
const PendingOrders = () => {
  const navigate = useNavigate();

  /* ===== STATE ===== */
  const [orders, setOrders] = useState<DonHang[]>([]);
  const [search, setSearch] = useState("");
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);
  const mapTrangThai = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chưa duyệt";
      case "APPROVED":
        return "Đã duyệt";
      case "SHIPPING":
        return "Chờ lấy hàng";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      case "REJECTED":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Chưa duyệt":
        return styles.pending;
      case "Đã duyệt":
        return styles.approved;
      case "Chờ lấy hàng":
        return styles.shipping;
      case "Hoàn thành":
        return styles.completed;
      case "Đã hủy":
        return styles.cancelled;
      case "Đã từ chối":
        return styles.rejected;
      default:
        return styles.pending;
    }
  };

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/order");
        if (!res.ok) throw new Error("Fetch orders failed");

        const data: OrderAPI[] = await res.json();

        const mapped: DonHang[] = data
          .map(o => ({
            idDon: o.orderId,
            ngayDat: o.orderDate,
            tenNguoiNhan: o.fullname ?? "—",
            sdtNguoiNhan: o.sdt ?? "—",
            trangThai: mapTrangThai(o.status),
          }))
          .sort((a, b) => {
            if (!a.ngayDat || !b.ngayDat) return 0;
            return new Date(b.ngayDat).getTime() - new Date(a.ngayDat).getTime();
          });

        setOrders(mapped);


        setOrders(mapped);
      } catch (err) {
        console.error(err);
        alert("❌ Không tải được danh sách đơn hàng");
      }
    };

    fetchOrders();
  }, []);


  /* ===== CLICK OUTSIDE → CLOSE DROPDOWN ===== */
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenStatusId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ===== SEARCH FILTER ===== */
  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();

    return orders.filter(o =>
      o.idDon.toLowerCase().includes(q) ||
      o.trangThai.toLowerCase().includes(q)
    );
  }, [search, orders]);


  /* ===== UPDATE STATUS ===== */
  const updateTrangThai = async (idDon: string, newStatusVN: string) => {
    // map ngược VN → EN cho BE
    const mapStatusToBE = (status: string) => {
      switch (status) {
        case "Chưa duyệt":
          return "PENDING";
        case "Đã duyệt":
          return "APPROVED";
        case "Chờ lấy hàng":
          return "SHIPPING";
        case "Hoàn thành":
          return "COMPLETED";
        case "Đã hủy":
          return "CANCELLED";
        case "Đã từ chối":
          return "REJECTED";
        default:
          return "PENDING";
      }
    };

    const statusBE = mapStatusToBE(newStatusVN);

    try {
      const res = await fetch(`http://localhost:8080/api/order/${idDon}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: statusBE,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      // optimistic update UI
      setOrders(prev =>
        prev.map(o =>
          o.idDon === idDon ? { ...o, trangThai: newStatusVN } : o
        )
      );

      setOpenStatusId(null);
    } catch (err) {
      console.error(err);
      alert("❌ Cập nhật trạng thái thất bại");
    }
  };



  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        {/* ===== HEADER ===== */}
        <div className={styles["content-header"]}>
          <h1 className={styles["content-title"]}>
            Danh sách đơn hàng chờ duyệt
          </h1>
        </div>

        {/* ===== SEARCH ===== */}
        <div className={styles["search-bar"]}>
          <input
            type="text"
            className={styles["search-input"]}
            placeholder="Tìm kiếm đơn hàng"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <i className={`ri-search-line ${styles["search-icon"]}`}></i>
        </div>

        {/* ===== TABLE ===== */}
        <div className={styles["data-table"]}>
          <div className={styles["table-header"]}>
            <div>Mã đơn hàng</div>
            <div>Ngày đặt</div>
            <div>Người nhận</div>
            <div>SĐT</div>
            <div>Trạng thái</div>
            <div>Thao tác</div>
          </div>

          {filteredOrders.length > 0 ? (
            filteredOrders.map(don => (
              <div className={styles["table-row"]} key={don.idDon}>
                <div className={styles.orderId}>#{don.idDon}</div>
                <div>
                  {don.ngayDat
                    ? new Date(don.ngayDat).toLocaleDateString("vi-VN")
                    : ""}
                </div>
                <div>{don.tenNguoiNhan}</div>
                <div>{don.sdtNguoiNhan}</div>

                {/* ===== STATUS ===== */}
                <div className={styles["status-cell"]}>
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(don.trangThai)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenStatusId(
                        openStatusId === don.idDon ? null : don.idDon
                      );
                    }}
                  >
                    {don.trangThai}
                  </span>


                  {openStatusId === don.idDon && (
                    <div
                      className={styles["status-menu"]}
                      onClick={e => e.stopPropagation()}
                    >
                      <select
                        value={don.trangThai}
                        onChange={e => updateTrangThai(don.idDon, e.target.value)}
                      >
                        <option>Chưa duyệt</option>
                        <option>Đã duyệt</option>
                        <option>Chờ lấy hàng</option>
                        <option>Hoàn thành</option>
                        <option>Đã từ chối</option>
                        <option>Đã hủy</option>
                      </select>

                    </div>
                  )}
                </div>

                {/* ===== ACTION ===== */}
                <div className={styles.action}>
                  <button
                    className={styles.viewDetailBtn}
                    onClick={() => navigate(`/admin/orders/${don.idDon}`)}
                  >

                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles["table-row"]}>
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: 20,
                }}
              >
                Không có đơn hàng nào chờ duyệt
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
