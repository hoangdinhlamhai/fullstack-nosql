import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users'; 

// Định nghĩa interface cho dữ liệu đăng ký
interface IRegisterData {
    phone_number: string;
    password: string;
    full_name: string;
    email?: string; 
    address?: string; 
}

export const register = async (data: IRegisterData) => {
    const payload = {
        sdt: data.phone_number,
        matKhau: data.password,
        hoVaTen: data.full_name,
        email: data.email || '',
        diaChi: data.address || ''
    };

    const res = await axios.post(`${API_URL}/register`, payload);
    return res.data;
};

export const login = async (input: string, password: string) => {
    const payload = {
        sdt: input,        // backend tự check sdt hoặc email
        email: input,
        matKhau: password
    };

    const res = await axios.post(`${API_URL}/login`, payload);
    return res.data; // hiện tại backend trả string
};