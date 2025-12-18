import React, { useState, useEffect } from 'react';
import './Account.css';
import { getUserByPhone, updateUser } from "../../api/userApi";

interface Role {
  roleId: string;
  roleName: string;
}

interface User {
  userId: string;
  sdt: string;
  fullName: string;
  email: string;
  address: string;
  avatar: string | null;
  password: string;
  roleId: Role;
  googleId?: string | null;
  deleted: boolean;
}


const AccountPage: React.FC = () => {
  const userStr = sessionStorage.getItem("user");
  const PHONE_LOGINED = userStr ? JSON.parse(userStr).sdt : null;

  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!PHONE_LOGINED) return;

    const fetchUser = async () => {
      try {
        const fetched = await getUserByPhone(PHONE_LOGINED);
        setUser(fetched);

        setFullName(fetched.fullName);
        setPhone(fetched.sdt);
        setEmail(fetched.email);
        setAddress(fetched.address);
      } catch (err) {
        console.error("Lỗi lấy user:", err);
      }
    };

    fetchUser();
  }, []);


  const handleSave = async () => {
  if (!user) return;

  try {
    const updated = await updateUser(user.userId, {
      fullName,
      sdt: phone,
      email,
      address,
      roleId: user.roleId,
      googleId: user.googleId
    });

    setUser(updated);
    setIsEditing(false);

    sessionStorage.setItem(
      "user",
      JSON.stringify({
        sdt: updated.sdt
      })
    );
    window.location.replace('/account');

    alert("Cập nhật thông tin thành công");
  } catch (err: any) {
    alert(err.response?.data || "Cập nhật thất bại");
  }
};


  if (!user) return <div>Đang tải...</div>;

  return (
    <div className="account-container">
      <div className="account-wrapper">   
        {/* Main content */}
        <main className="account-main">
          <h2 className="page-title">Thông tin tài khoản</h2>

          <div className="info-card">
            <div className="card-header">
              <h3>Thông tin cá nhân</h3>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Hủy
                  </button>
                  <button className="save-btn" onClick={handleSave}>
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>Họ và tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                ) : (
                  <p>{fullName || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div className="info-item">
                <label>Số điện thoại</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                ) : (
                  <p>{phone || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div className="info-item">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="readonly"
                  />
                ) : (
                  <p>{email}</p>
                )}
              </div>

              <div className="info-item full-width">
                <label>Địa chỉ</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ chi tiết..."
                  />
                ) : (
                  <p>{address || 'Chưa cập nhật địa chỉ'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header">
              <h3>Thông tin đăng nhập</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Phương thức đăng nhập</label>
                <p>'Email & Mật khẩu'</p>
              </div>
              <div className="info-item">
                <label>Vai trò</label>
                <p><p>{user.roleId.roleName}</p></p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;