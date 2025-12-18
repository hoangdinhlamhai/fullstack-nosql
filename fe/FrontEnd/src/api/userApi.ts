import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

// GET user theo SĐT
export const getUserByPhone = async (sdt: string) => {
  const res = await axios.get(`${API_URL}/sdt/${sdt}`);
  return res.data;
};

// UPDATE user
export const updateUser = async (userId: string, data: any) => {
  const payload = {
    fullName: data.fullName,
    sdt: data.sdt,
    email: data.email,
    address: data.address,
    avatar: data.avatar || null,
    password: data.password || null,
    roleId: data.roleId,
    googleId: data.googleId || null
  };

  const res = await axios.put(`${API_URL}/${userId}`, payload);
  return res.data;
};
