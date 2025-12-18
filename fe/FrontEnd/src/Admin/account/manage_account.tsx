import React, { useEffect, useState } from "react";
import styles from "./manage_account.module.css";

interface Role {
  roleId: string;
  roleName: string;
}


/* ===== TYPES ===== */
interface Account {
  userId: string;
  Sdt: string;
  HoVaTen: string;
  Email: string;
  MatKhau: string;
  DiaChi: string;
  IDQuyen?: string | null;
  TenQuyen?: string;
}

const ITEMS_PER_PAGE = 5;

const AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);


  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);


  const openAdd = () => {
    setEditingAccount({
      userId: "",
      Sdt: "",
      HoVaTen: "",
      Email: "",
      MatKhau: "",
      DiaChi: "",
      IDQuyen: null,
      TenQuyen: "Chưa phân quyền",
    });
    setShowAddModal(true);
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/roles");
        const raw = await res.json();

        console.log("ROLES RAW:", raw);

        // nếu BE trả { data: [...] } thì lấy đúng mảng
        const arr = Array.isArray(raw) ? raw : (raw?.data ?? []);

        const mapped: Role[] = arr.map((r: any) => ({
          roleId: String(r.roleId ?? r.id ?? r._id ?? r.roleID ?? ""),
          roleName: String(r.roleName ?? r.name ?? r.role_name ?? r.tenQuyen ?? ""),
        })).filter((r: Role) => r.roleId && r.roleName);

        console.log("ROLES MAPPED:", mapped);

        setRoles(mapped);
      } catch (err) {
        console.error("Lỗi load roles:", err);
      }
    };

    fetchRoles();
  }, []);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/users");
        const data = await res.json();

        setAccounts(
          data.map((u: any) => ({
            userId: u.userId,
            Sdt: u.sdt,
            HoVaTen: u.fullName,
            Email: u.email,
            MatKhau: "*****",
            DiaChi: u.address,
            IDQuyen: u.roleId ?? null, // string
            TenQuyen: "",              // map sau
          }))
        );
      } catch (err) {
        console.error("Lỗi load users:", err);
      }
    };

    fetchUsers();
  }, []);



  /* ===== FILTER + SEARCH ===== */
  useEffect(() => {
  let base = accounts.map(acc => {
    const role = roles.find(r => r.roleId === acc.IDQuyen);

    return {
      ...acc,
      TenQuyen: role?.roleName ?? "Chưa phân quyền",
    };
  });

  // filter theo quyền
  if (currentFilter === "null") {
    base = base.filter(a => !a.IDQuyen);
  } else if (currentFilter !== "all") {
    base = base.filter(a => a.IDQuyen === currentFilter);
  }

  // search
  if (search.trim()) {
    const lower = search.toLowerCase();
    base = base.filter(a =>
      a.HoVaTen.toLowerCase().includes(lower)
    );
  }

  setFilteredAccounts(base);
  setCurrentPage(1);
}, [accounts, roles, currentFilter, search]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageData = filteredAccounts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  /* ===== ACTIONS ===== */
  const openEdit = (acc: Account) => {
    setEditingAccount(acc);
    setShowEditModal(true);
  };

const handleDelete = async (sdt: string) => {
  if (!window.confirm("Bạn chắc chắn muốn xóa tài khoản này?")) return;

  try {
    const res = await fetch(
      `http://localhost:8080/api/users/by-sdt/${sdt}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      alert(await res.text());
      return;
    }

    setAccounts(prev => prev.filter(acc => acc.Sdt !== sdt));
    alert("Đã xóa tài khoản");
  } catch (err) {
    console.error(err);
    alert("Lỗi khi xóa tài khoản");
  }
};


  const handleRegister = async () => {
    if (!editingAccount) return;

    if (!editingAccount.Sdt || !editingAccount.MatKhau) {
      alert("Số điện thoại và mật khẩu không được để trống");
      return;
    }

    if (!editingAccount.IDQuyen) {
      alert("Vui lòng chọn quyền cho tài khoản");
      return;
    }

    try {
      const payload = {
        sdt: editingAccount.Sdt,
        hoVaTen: editingAccount.HoVaTen,
        email: editingAccount.Email,
        matKhau: editingAccount.MatKhau,
        diaChi: editingAccount.DiaChi,
        roleId: editingAccount.IDQuyen, // 👈 STRING
      };

      const res = await fetch("http://localhost:8080/api/users/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg);
        return;
      }

      alert("Thêm tài khoản thành công");

      setShowAddModal(false);
      setEditingAccount(null);

      // reload user list
      window.location.reload();
    } catch (err) {
      console.error("Register error:", err);
      alert("Lỗi khi thêm tài khoản");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingAccount) return;

    try {
      const payload = {
        fullName: editingAccount.HoVaTen,
        email: editingAccount.Email,
        sdt: editingAccount.Sdt,
        address: editingAccount.DiaChi,
        password: editingAccount.MatKhau || null,
        roleId: editingAccount.IDQuyen, // ✅ STRING
      };

      const res = await fetch(
        `http://localhost:8080/api/users/${editingAccount.userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        alert(await res.text());
        return;
      }

      const updated = await res.json();

      setAccounts(prev =>
        prev.map(acc =>
          acc.userId === updated.userId
            ? {
              ...acc,
              HoVaTen: updated.fullName,
              Email: updated.email,
              Sdt: updated.sdt,
              DiaChi: updated.address,
              IDQuyen: updated.roleId,
            }
            : acc
        )
      );

      setShowEditModal(false);
      setEditingAccount(null);
      alert("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật tài khoản");
    }
  };

  
  

  return (
    <>
      <div className={styles.container}>
        <div className={styles["content-container"]}>
          <div className={styles["content-header"]}>
            <h1>Quản lý tài khoản</h1>

            <div className={styles["search-filter-container"]}>
              <div className={styles["search-box"]}>
                <i className="fas fa-search"></i>
                <input
                  placeholder="Tìm kiếm tài khoản theo tên"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className={styles["filter-dropdown"]}>
                <div
                  className={styles["filter-button"]}
                  onClick={() =>
                    document
                      .getElementById("filterDropdown")
                      ?.classList.toggle(styles.show)
                  }
                >
                  <i className="fas fa-filter"></i>
                  <span>
                    {currentFilter === "all"
                      ? "Quyền hạn"
                      : currentFilter === "null"
                        ? "Chưa phân quyền"
                        : roles.find(r => r.roleId === currentFilter)?.roleName
                    }
                  </span>

                </div>

                <div className={styles["filter-content"]} id="filterDropdown">
                  <button
                    className={styles["filter-option"]}
                    onClick={() => setCurrentFilter("all")}
                  >
                    Tất cả quyền hạn
                  </button>


                  {roles.map(role => (


                    <button
                      key={role.roleId}
                      className={styles["filter-option"]}
                      onClick={() => setCurrentFilter(role.roleId)}
                    >
                      {role.roleName}
                    </button>
                  ))}


                  <button
                    className={styles["filter-option"]}
                    onClick={() => setCurrentFilter("null")}
                  >
                    Chưa phân quyền
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== TABLE ===== */}
          <div className={styles["accounts-table"]}>
            <table>
              <thead>
                <tr>
                  <th>Số điện thoại</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Mật khẩu</th>
                  <th>Địa chỉ</th>
                  <th>Quyền hạn</th>
                  <th>Cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map(acc => (
                  <tr key={acc.Sdt}>
                    <td>
                      <span className={styles["phone-badge"]}>{acc.Sdt}</span>
                    </td>
                    <td>{acc.HoVaTen}</td>
                    <td>{acc.Email}</td>
                    <td>{acc.MatKhau}</td>
                    <td>{acc.DiaChi}</td>
                    <td>{acc.TenQuyen ?? "Chưa phân quyền"}</td>
                    <td>
                      <div className={styles["action-buttons"]}>
                        <button
                          className={styles["edit-btn"]}
                          onClick={() => openEdit(acc)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className={styles["lock-btn"]}
                          onClick={() => handleDelete(acc.Sdt)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== PAGINATION ===== */}
          <div className={styles["pagination-container"]}>
            <div className={styles["pagination-info"]}>
              Trang {currentPage}/{totalPages || 1} — Hiển thị{" "}
              {filteredAccounts.length}
            </div>

            <div className={styles["pagination-controls"]}>
              <button
                className={styles["pagination-button"]}
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                className={styles["pagination-button"]}
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            <button
              className={styles["add-account-btn"]}
              onClick={openAdd}
            >
              Thêm tài khoản
            </button>

          </div>
        </div>
      </div>

      {/* ===== ADD MODAL ===== */}
      {showAddModal && (
        <div className={styles.modal} onClick={() => setShowAddModal(false)}>
          <div
            className={styles["modal-content"]}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles["modal-header"]}>
              <h2>Thêm tài khoản</h2>
            </div>
            <div className={styles["modal-body"]}>
              {/* ===== EDIT FORM ===== */}
              <div className={styles["form-group"]}>
                <label>SỐ ĐIỆN THOẠI</label>
                <input
                  type="text"
                  value={editingAccount?.Sdt || ""}
                  placeholder="--Số điện thoại"
                  onChange={(e) =>
                    setEditingAccount(prev =>
                      prev ? { ...prev, Sdt: e.target.value } : prev
                    )
                  }
                />
              </div>


              <div className={styles["form-group"]}>
                <label>HỌ VÀ TÊN</label>
                <input
                  type="text"
                  placeholder="--Họ và tên"
                  value={editingAccount?.HoVaTen || ""}
                  onChange={(e) =>
                    setEditingAccount(prev =>
                      prev ? { ...prev, HoVaTen: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div className={styles["form-group"]}>
                <label>EMAIL</label>
                <input
                  type="text"
                  placeholder="--Email"
                  value={editingAccount?.Email || ""}
                  onChange={(e) =>
                    setEditingAccount(prev =>
                      prev ? { ...prev, Email: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div className={styles["form-group"]}>
                <label>MẬT KHẨU</label>
                <input
                  type="text"
                  placeholder="--Mật khẩu"
                  value={editingAccount?.MatKhau || ""}
                  onChange={(e) =>
                    setEditingAccount(prev =>
                      prev ? { ...prev, MatKhau: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div className={styles["form-group"]}>
                <label>ĐỊA CHỈ</label>
                <input
                  type="text"
                  placeholder="--Địa chỉ"
                  value={editingAccount?.DiaChi || ""}
                  onChange={(e) =>
                    setEditingAccount(prev =>
                      prev ? { ...prev, DiaChi: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div className={styles["form-group"]}>
                <label>PHÂN QUYỀN</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={editingAccount?.IDQuyen ?? ""}
                    onChange={(e) =>
                      setEditingAccount(prev =>
                        prev
                          ? { ...prev, IDQuyen: e.target.value }
                          : prev
                      )
                    }
                  >
                    {roles.map(role => (
                      <option key={role.roleId} value={role.roleId}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className={styles["modal-footer"]}>
              <button
                className={styles["submit-btn"]}
                onClick={handleRegister}
              >
                Thêm tài khoản
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && editingAccount && (
        <div
          className={styles.modal}
          onClick={() => {
            setShowEditModal(false);
            setEditingAccount(null);
          }}
        >
          <div
            className={styles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["modal-header"]}>
              <h2>Sửa tài khoản</h2>
            </div>

            <div className={styles["modal-body"]}>
              {/* ===== EDIT FORM ===== */}
              <div className={styles["form-group"]}>
                <label>SỐ ĐIỆN THOẠI</label>
                <input
                  type="text"
                  value={editingAccount.Sdt || ""}
                  placeholder="--Số điện thoại"
                  onChange={(e) =>
                    setEditingAccount((prev) =>
                      prev ? { ...prev, Sdt: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div className={styles["form-group"]}>
                <label>HỌ VÀ TÊN</label>
                <input
                  type="text"
                  placeholder="--Họ và tên"
                  value={editingAccount.HoVaTen || ""}
                  onChange={(e) =>
                    setEditingAccount((prev) =>
                      prev ? { ...prev, HoVaTen: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div className={styles["form-group"]}>
                <label>EMAIL</label>
                <input
                  type="text"
                  placeholder="--Email"
                  value={editingAccount.Email || ""}
                  onChange={(e) =>
                    setEditingAccount((prev) =>
                      prev ? { ...prev, Email: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div className={styles["form-group"]}>
                <label>MẬT KHẨU</label>
                <input
                  type="text"
                  placeholder="--Mật khẩu"
                  value={editingAccount.MatKhau || ""}
                  onChange={(e) =>
                    setEditingAccount((prev) =>
                      prev ? { ...prev, MatKhau: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div className={styles["form-group"]}>
                <label>ĐỊA CHỈ</label>
                <input
                  type="text"
                  placeholder="--Địa chỉ"
                  value={editingAccount.DiaChi || ""}
                  onChange={(e) =>
                    setEditingAccount((prev) =>
                      prev ? { ...prev, DiaChi: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div className={styles["form-group"]}>
                <label>PHÂN QUYỀN</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={editingAccount?.IDQuyen ?? ""}
                    onChange={(e) =>
                      setEditingAccount(prev =>
                        prev ? { ...prev, IDQuyen: e.target.value || null } : prev
                      )
                    }
                    disabled={roles.length === 0}
                  >
                    <option value="">
                      {roles.length === 0 ? "-- Đang tải quyền... --" : "-- Chọn quyền --"}
                    </option>

                    {roles.map(role => (
                      <option key={role.roleId} value={role.roleId}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className={styles["modal-footer"]}>
              <button
                className={styles["submit-btn"]}
                onClick={handleUpdateUser}
              >
                Lưu thay đổi
              </button>

              <button
                className={styles["cancel-btn"]}
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAccount(null);
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default AccountManagement;
