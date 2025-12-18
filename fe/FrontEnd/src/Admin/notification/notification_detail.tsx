import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./notification_detail.module.css";

/* ================= TYPES ================= */
interface TaiKhoan {
  sdt: string;
}

interface NotificationDetail {
  id: number;
  tieuDe: string;
  noiDung: string;
  loaiThongBao?: string;
  taiKhoans: TaiKhoan[];
}

/* ================= COMPONENT ================= */
const NotificationDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ===== STATE ===== */
  const [notification, setNotification] =
    useState<NotificationDetail | null>(null);

  const [showRecipients, setShowRecipients] = useState(false);

  /* ===== MOCK DATA (SAU NÀY GẮN API) ===== */
  useEffect(() => {
    // mock giống Razor Model
    setNotification({
      id: Number(id),
      tieuDe: "Thông báo bảo trì hệ thống",
      noiDung: `Hệ thống sẽ bảo trì từ 22h đến 23h hôm nay.
Mong quý khách thông cảm.`,
      loaiThongBao: "Thông báo bảo trì",
      taiKhoans: [
        { sdt: "0981234567" },
        { sdt: "0912345678" },
        { sdt: "0909123456" },
      ],
    });
  }, [id]);

  /* ===== HANDLERS ===== */
  const goBack = () => {
    navigate(-1);
  };

  const handleDelete = () => {
    if (!notification) return;

    if (!confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;

    // TODO: axios.post delete
    alert("Xóa thông báo thành công!");
    navigate("/notifications");
  };

  /* ================= RENDER ================= */
return (
  <div className={styles["main-content"]}>
    <div className={styles.container}>
      <div className={styles.content}>
        {/* ===== HEADER ===== */}
        <div className={styles["notification-header"]}>
          <span
            className={styles["back-icon"]}
            onClick={goBack}
          >
            &#10094;
          </span>

          <h1
            className={styles["notification-title"]}
            onClick={() => navigate("/notifications")}
            style={{ cursor: "pointer" }}
          >
            Chi tiết thông báo
          </h1>
        </div>

        {/* ===== CONTENT ===== */}
        {notification ? (
          <div className={styles["notification-details"]}>
            {/* ===== INFO ===== */}
            <div className={styles["notification-info"]}>
              <div className={styles["sender-info"]}>
                <div className={styles.avatar}>A</div>

                <div className={styles["sender-details"]}>
                  <span className={styles["sender-name"]}>
                    Admin
                  </span>

                  <span className={styles.recipient}>
                    {notification.taiKhoans &&
                    notification.taiKhoans.length > 0 ? (
                      notification.taiKhoans.length === 1 ? (
                        `Đến: ${notification.taiKhoans[0].sdt}`
                      ) : (
                        `Đến: ${notification.taiKhoans.length} người nhận`
                      )
                    ) : (
                      "Đến: Chưa xác định"
                    )}
                  </span>
                </div>
              </div>

              <div className={styles["meta-info"]}>
                <div className={styles["loaithongbao-container"]}>
                  <div className={styles.loaithongbao}>
                    Loại thông báo:
                  </div>
                  <div className={styles["loaithongbao-content"]}>
                    {notification.loaiThongBao ?? "Chưa phân loại"}
                  </div>
                </div>

                <div className={styles["ngaydang-container"]}>
                  <div className={styles.ngaydang}>Ngày đăng:</div>
                  <div className={styles["ngaydang-content"]}>
                    {new Date().toLocaleDateString("vi-VN")}
                  </div>
                </div>

                <div className={styles["mathongbao-container"]}>
                  <div className={styles.mathongbao}>
                    Mã thông báo:
                  </div>
                  <div className={styles["mathongbao-content"]}>
                    #{notification.id}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== BODY ===== */}
            <div className={styles["notification-body"]}>
              <h2 className={styles["notification-heading"]}>
                {notification.tieuDe}
              </h2>

              <div
                className={styles["notification-content"]}
                dangerouslySetInnerHTML={{
                  __html: notification.noiDung.replace(/\n/g, "<br/>"),
                }}
              />
            </div>

            {/* ===== ACTION BUTTONS ===== */}
            <div className={styles["action-buttons"]}>
              <button
                className={`${styles.btn} ${styles["btn-danger"]}`}
                onClick={handleDelete}
              >
                <i className="fas fa-trash"></i>
                Xóa thông báo
              </button>

              <button
                className={`${styles.btn} ${styles["btn-secondary"]}`}
                onClick={() => navigate("/notifications")}
              >
                <i className="fas fa-arrow-left"></i>
                Quay lại
              </button>
            </div>
          </div>
        ) : (
          <div className={styles["error-message"]}>
            <h2>Không tìm thấy thông báo</h2>
            <p>
              Thông báo bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <button
              className={`${styles.btn} ${styles["btn-primary"]}`}
              onClick={() => navigate("/notifications")}
            >
              Quay lại danh sách
            </button>
          </div>
        )}
      </div>

      {/* ===== RECIPIENTS LIST ===== */}
      {notification &&
        notification.taiKhoans &&
        notification.taiKhoans.length > 1 && (
          <div className={styles["recipients-section"]}>
            <h3>
              Danh sách người nhận ({notification.taiKhoans.length} người)
            </h3>

            <button
              className={styles["toggle-btn"]}
              onClick={() => setShowRecipients(prev => !prev)}
            >
              {showRecipients ? "Ẩn danh sách" : "Xem danh sách"}
            </button>

            {showRecipients && (
              <div className={styles["recipients-list"]}>
                {notification.taiKhoans.map((tk, idx) => (
                  <div
                    key={idx}
                    className={styles["recipient-item"]}
                  >
                    <i className="fas fa-user"></i>
                    <span>{tk.sdt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  </div>
  );
};

export default NotificationDetailPage;
