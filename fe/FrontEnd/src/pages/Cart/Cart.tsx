import React, { useState } from "react";
import CartItem from "../Cart/Item/CartItem";
import "../Cart/Cart.css";
import IP from "../../assets/img/ip.png";
import { useNavigate } from "react-router-dom";
import type { CartProduct } from "../../services/Interface";


const Cart: React.FC = () => {
    const navigate = useNavigate();

    const goToCheckout = () => {
        const selected = items.filter(i => i.checked);
        navigate("/check-out", { state: { selected } });
    };

    const [items, setItems] = useState<CartProduct[]>([
        {
            id: 1,
            name: "iPhone Air 256GB | Chính hãng VN/A - Xanh Da Trời",
            price: 30890000,
            oldPrice: 31990000,
            image: IP,
            quantity: 1,
            checked: true,
        },
        {
            id: 2,
            name: "iPhone Air 256GB | Chính hãng VN/A - Xanh Da Trời",
            price: 30890000,
            oldPrice: 31990000,
            image: IP,
            quantity: 1,
            checked: true,
        },
        {
            id: 3,
            name: "iPhone Air 256GB | Chính hãng VN/A - Xanh Da Trời",
            price: 30890000,
            oldPrice: 31990000,
            image: IP,
            quantity: 1,
            checked: true,
        },
        {
            id: 4,
            name: "iPhone Air 256GB | Chính hãng VN/A - Xanh Da Trời",
            price: 30890000,
            oldPrice: 31990000,
            image: IP,
            quantity: 1,
            checked: true,
        },
        {
            id: 5,
            name: "iPhone Air 256GB | Chính hãng VN/A - Xanh Da Trời",
            price: 30890000,
            oldPrice: 31990000,
            image: IP,
            quantity: 1,
            checked: true,
        },
    ]);

    const toggleCheck = (id: number) =>
        setItems(prev =>
            prev.map(i => (i.id === id ? { ...i, checked: !i.checked } : i))
        );

    const increase = (id: number) =>
        setItems(prev =>
            prev.map(i => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
        );

    const decrease = (id: number) =>
        setItems(prev =>
            prev.map(i =>
                i.id === id && i.quantity > 1
                    ? { ...i, quantity: i.quantity - 1 }
                    : i
            )
        );

    const removeItem = (id: number) =>
        setItems(prev => prev.filter(i => i.id !== id));

    const toggleAll = () => {
        const allChecked = items.every(i => i.checked);
        setItems(prev => prev.map(i => ({ ...i, checked: !allChecked })));
    };

    // 🟢 Tính tổng tạm tính + tiết kiệm + số lượng được chọn
    const total = items
        .filter(i => i.checked)
        .reduce((sum, i) => sum + i.price * i.quantity, 0);

    const totalOld = items
        .filter(i => i.checked)
        .reduce((sum, i) => sum + (i.oldPrice ?? i.price) * i.quantity, 0);

    const saved = totalOld - total;
    const checkedCount = items.filter(i => i.checked).length;

    return (
        <div className="cart-container">
            <div className="cart-top">
                <label className="cart-select-all">
                    <input
                        type="checkbox"
                        checked={items.every(i => i.checked)}
                        onChange={toggleAll}
                    />
                    Bỏ chọn tất cả
                </label>

                <button className="cart-delete-selected">
                    Xóa sản phẩm đã chọn
                </button>
            </div>

            {items.map(item => (
                <CartItem
                    key={item.id}
                    {...item}
                    onToggleCheck={toggleCheck}
                    onIncrease={increase}
                    onDecrease={decrease}
                    onRemove={removeItem}
                />
            ))}

            {/* 🟢 Phần Tạm tính + Tiết kiệm + Mua ngay */}
            <div className="cart-summary">
                <div className="cart-summary-left">
                    <p className="cart-total">
                        Tạm tính:
                        <span className="price">{total.toLocaleString()}đ</span>
                    </p>
                    <p className="cart-save">
                        Tiết kiệm:
                        <span className="save">{saved.toLocaleString()}đ</span>
                    </p>
                </div>

                <button className="buy-now" onClick={goToCheckout}>
                    Mua ngay ({checkedCount})
                </button>
            </div>
        </div>
    );
};

export default Cart;
