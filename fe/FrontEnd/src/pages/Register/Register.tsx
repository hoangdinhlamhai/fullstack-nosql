import { useState } from 'react';
import './Register.css';
import { register } from '../../api/authApi';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        email: '',
        address: '',
        password: '',
        retype_pass: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.retype_pass) {
            alert('Mật khẩu nhập lại không khớp!');
            return;
        }

        try {
            await register(formData);
            alert('Đăng ký thành công!');
            window.location.replace('/login');
        } catch (err: any) {
            alert(err.response?.data || 'Đăng ký thất bại');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="full_name"
                placeholder="Họ và tên"
                value={formData.full_name}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="phone_number"
                placeholder="Số điện thoại"
                value={formData.phone_number}
                onChange={handleChange}
                required
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />

            <input
                type="text"
                name="address"
                placeholder="Địa chỉ"
                value={formData.address}
                onChange={handleChange}
            />

            <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="retype_pass"
                placeholder="Nhập lại mật khẩu"
                value={formData.retype_pass}
                onChange={handleChange}
                required
            />

            <button type="submit" className="login-btn">
                Tạo tài khoản
            </button>
        </form>
    );
};

export default RegisterForm;
