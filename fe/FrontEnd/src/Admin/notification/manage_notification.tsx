import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./manage_notification.module.css";

/* ================= TYPES ================= */
interface Notification {
  id: number;
  tieuDe: string;
  noiDung: string;
  loaiThongBao: string;
}

/* ================= COMPONENT ================= */
const NotificationManagement = () => {
  const navigate = useNavigate();

  /* ===== DATA ===== */
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /* ===== SEARCH ===== */
  const [search, setSearch] = useState("");

  /* ===== PAGINATION ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ===== MODAL ===== */
  const [showModal, setShowModal] = useState(false);

  /* ===== FORM ===== */
  const [tieuDe, setTieuDe] = useState("");
  const [loaiThongBao, setLoaiThongBao] = useState("");
  const [doiTuongNhan, setDoiTuongNhan] = useState("");
  const [sdtNguoiNhan, setSdtNguoiNhan] = useState("");
  const [noiDung, setNoiDung] = useState("");

  /* ===== MOCK DATA (XÓA KHI GẮN API) ===== */
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        tieuDe: "Thông báo bảo trì",
        noiDung:
          "Hệ thống sẽ bảo trì từ 22h đến 23h hôm nay. Mong quý khách thông cảm.",
        loaiThongBao: "Thông báo bảo trì",
      },
      {
        id: 2,
        tieuDe: "Thông báo khuyến mãi",
        noiDung:
          "Giảm giá 20% cho tất cả sản phẩm trong tuần này.",
        loaiThongBao: "Thông báo khuyến mãi",
      },
    ]);
  }, []);

  /* ===== SEARCH FILTER ===== */
  const filteredNotifications = useMemo(() => {
    if (!search.trim()) return notifications;
    return notifications.filter(n =>
      n.tieuDe.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, notifications]);

  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / itemsPerPage)
  );

  const pagedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ===== HANDLERS ===== */
  const handleDelete = (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tieuDe || !loaiThongBao || !doiTuongNhan || !noiDung) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newNoti: Notification = {
      id: Date.now(),
      tieuDe,
      noiDung,
      loaiThongBao,
    };

    setNotifications(prev => [newNoti, ...prev]);
    setShowModal(false);

    setTieuDe("");
    setLoaiThongBao("");
    setDoiTuongNhan("");
    setSdtNguoiNhan("");
    setNoiDung("");
  };

  /* ================= RENDER ================= */
  return (
  <div className={styles["main-content"]}>
    {/* HEADER */}
    <div className={styles.header}>
      <div className={`${styles["user-info"]} ${styles.dropdown}`}></div>
    </div>

    {/* TITLE + SEARCH */}
    <div className={styles["content-header"]}>
      <h1 className={styles["content-title"]}>Quản lý thông báo</h1>

      <div className={styles["search-bar"]}>
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
    </div>

    <div className={styles.container}>
      <div className={styles["content-area"]}>
        {pagedNotifications.length > 0 ? (
          pagedNotifications.map(tb => (
            <div
              key={tb.id}
              className={styles["notification-card"]}
            >
              <div className={styles["notification-header"]}>
                <div className={styles["date-posted"]}>
                  Ngày đăng: {new Date().toLocaleDateString("vi-VN")}
                </div>

                <button
                  className={styles["delete-btn"]}
                  onClick={() => handleDelete(tb.id)}
                >
                  <i className="fas fa-trash"></i>
                  Xoá
                </button>
              </div>

              <div
                onClick={() => navigate(`/notifications/${tb.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles["notification-content"]}>
                  <div className={styles["notification-info"]}>
                    <h3 className={styles["notification-title"]}>
                      {tb.tieuDe}
                    </h3>
                    <p className={styles["notification-text"]}>
                      {tb.noiDung.length > 100
                        ? tb.noiDung.substring(0, 100) + "..."
                        : tb.noiDung}
                    </p>
                  </div>

                  <div className={styles["notification-author"]}>
                    <div>Người đăng:</div>
                    <div className={styles["author-name"]}>Admin</div>
                  </div>
                </div>
              </div>

              <div className={styles["notification-footer"]}>
                <div className={styles["notification-id"]}>
                  Mã thông báo: #{tb.id}
                </div>

                <div className={styles["notification-type"]}>
                  <span className={styles["notification-type-label"]}>
                    Loại thông báo:
                  </span>
                  <span>{tb.loaiThongBao}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles["no-notifications"]}>
            <p>Không có thông báo nào được tìm thấy.</p>
          </div>
        )}

        {/* PAGINATION */}
        <div className={styles["pagination-area"]}>
          <div className={styles["page-info"]}>
            Trang {currentPage}/{totalPages}
          </div>

          <div className={styles["pagination-controls"]}>
            <button
              type="button"
              className={styles["create-notification-btn"]}
              onClick={() => setShowModal(true)}
            >
              Đăng thông báo
            </button>

            <div className={styles["pagination-buttons"]}>
              <button
                className={`${styles["pagination-btn"]} ${styles.prev}`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                ◀
              </button>

              <button
                className={`${styles["pagination-btn"]} ${styles.next}`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* MODAL */}
    {showModal && (
      <div
        className={styles.modal}
        onClick={() => setShowModal(false)}
      >
        <div
          className={styles["modal-content"]}
          onClick={e => e.stopPropagation()}
        >
          <div className={styles["modal-header"]}>
            <h2>Đăng thông báo</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles["modal-body"]}>
              {/* giữ nguyên form */}
            </div>

            <div className={styles["modal-footer"]}>
              <button className={styles["submit-btn"]}>
                Đăng thông báo
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  );
};

export default NotificationManagement;
