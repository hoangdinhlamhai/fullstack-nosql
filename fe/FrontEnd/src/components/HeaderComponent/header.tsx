import { useState, useEffect } from 'react'
import Logo from "../../assets/img/logo.png"
import { UserCog, ShoppingCart, History, LogOut } from 'lucide-react';
import axios from 'axios';

import "./header.css"
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigative = useNavigate();

    const getUserFromSession = () => {
        const data = sessionStorage.getItem("user");
        return data ? JSON.parse(data) : null;
    };


    const [user, setUser] = useState<any>(getUserFromSession());
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/categories") // đổi đúng URL API của bạn
            .then(res => {
                setCategories(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    const handleTabChange = (key: string) => {
        // key dạng: category-<id> | about | history
        if (key.startsWith("category-")) {
            const categoryId = key.replace("category-", "");
            navigative(`/products/${categoryId}`);
            return;
        }

        if (key === "about") {
            navigative("/about");
            return;
        }

        if (key === "history") {
            navigative("/historyOrder");
            return;
        }

        if (key === "home") {
            navigative("/");
            return;
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        setUser(null);
        setDropdownOpen(false);
        navigative('/login');
    };


    const items: TabsProps['items'] = [
        {
            key: 'home',
            label: 'Tất cả',
        },
        ...categories.map((c) => ({
            key: `category-${c.categoryId}`,
            label: c.categoryName
        })),
        {
            key: 'about',
            label: 'Blog về chúng tôi',
        },
        {
            key: 'history',
            label: 'Lịch sử mua hàng',
        }
    ];

    return (
        <div className="header">
            <div className="navbar-top">
                <div className="top-left">
                    <div className="logo" onClick={() => navigative('/')}>
                        <a className="logo-link" href='#'>
                            <img
                                className="logo-link-img"
                                src={Logo}
                                alt="Logo"
                                style={{ cursor: 'pointer' }}
                            />
                        </a>
                    </div>
                    <div className="navbar-filter">
                        <div className="search-wrapper">
                            <i className="fa-solid fa-location-dot search-icon"></i>
                            <input type="text" className="search-input" placeholder="Tìm kiếm sản phẩm" />
                        </div>

                        <div className="filter-wrapper">
                            <i className="fa-solid fa-filter"></i>
                            <span className="filter-text">Bộ lọc</span>
                        </div>
                    </div>
                </div>

                <div className="top-right">
                    <ul className="list-user-actions">
                        <li className="list-user-item" onClick={() => navigative('/account')}>
                            <i className="fa-solid fa-user-plus"></i>
                            <p className="list-user-item-text">Tài khoản</p>
                        </li>
                        <li className="list-user-item" onClick={() => navigative('/cartShop')} >
                            <i className="fa-solid fa-cart-shopping"></i>
                            <p className="list-user-item-text">Giỏ hàng</p>
                        </li>
                        <li className="list-user-item" onClick={() => navigative('/AddListing')} style={{ cursor: 'pointer' }}>
                            <i className="fa-solid fa-right-to-bracket"></i>
                            <p className="list-user-item-text">Đăng tin</p>
                        </li>
                        {user ? (
                            <li className="list-user-item user-avatar-item">
                                <div
                                    className="user-avatar-trigger"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <div className="avatar-circle">
                                        {user.sdt.slice(-3)}
                                    </div>
                                    <div className="user-info">
                                        <p className="greeting">Xin chào</p>
                                        <p className="phone">{user.sdt}</p>
                                    </div>
                                    <svg className={`arrow ${dropdownOpen ? 'rotated' : ''}`} viewBox="0 0 24 24">
                                        <path d="M7 10l5 5 5-5z" />
                                    </svg>
                                </div>
                            </li>
                        ) : (
                            <li className="list-user-item list-user-item-button" onClick={() => navigative('/login')} style={{ cursor: 'pointer' }}>
                                <i className="fa-solid fa-right-to-bracket"></i>
                                <p className="list-user-item-text">Đăng nhập</p>
                            </li>
                        )}
                    </ul>

                    {user && dropdownOpen && (
                        <>
                            <div className="dropdown-overlay" onClick={() => setDropdownOpen(false)} />
                            <div className="user-dropdown">
                                <div className="dropdown-header">
                                    <p>Tài khoản của tôi</p>
                                    <p className="phone-big">{user.sdt}</p>
                                </div>
                                <div className="dropdown-body">
                                    <div className="dropdown-item" onClick={() => { navigative('/account'); setDropdownOpen(false); }}>
                                        <UserCog size={20} />
                                        <div>
                                            <p className="title">Quản lý hồ sơ</p>
                                            <p className="desc">Thông tin cá nhân, đổi mật khẩu</p>
                                        </div>
                                    </div>
                                    <div className="dropdown-item" onClick={() => { navigative('/cartShop'); setDropdownOpen(false); }}>
                                        <ShoppingCart size={20} />
                                        <div>
                                            <p className="title">Giỏ hàng & Thanh toán</p>
                                        </div>
                                    </div>
                                    <div className="dropdown-item" onClick={() => { navigative('/historyOrder'); setDropdownOpen(false); }}>
                                        <History size={20} />
                                        <div>
                                            <p className="title">Lịch sử mua hàng</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="dropdown-item logout" onClick={handleLogout}>
                                        <LogOut size={20} />
                                        <span>Đăng xuất</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="navbar-bot">
                {/* <ul className="list-category">
                    <li className="list-category-item">
                        <a href="" className="link-category">Phòng trọ</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Căn hộ cao cấp</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Căn hộ chung cư</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Nhà nguyên căn</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Căn hộ ở ghép</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Căn hộ mini</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Mặt bằng cho thuê</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Blog về chúng tôi</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Bảng giá dịch vụ</a>
                    </li>
                </ul> */}

                {/* <Tabs className='list-category' defaultActiveKey="1" items={items} /> */}


                <div className="navbar-bot">
                    <Tabs
                        className="list-category"
                        items={items}
                        onChange={handleTabChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default Header   