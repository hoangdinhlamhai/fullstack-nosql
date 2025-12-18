import React from "react";
import "../Cart.css";

type CartItemProps = {
    id: number;
    name: string;
    image: string;
    price: number;
    oldPrice?: number;
    quantity: number;
    checked: boolean;
    onToggleCheck: (id: number) => void;
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
    onRemove: (id: number) => void;
};

const CartItem: React.FC<CartItemProps> = ({
    id,
    name,
    image,
    price,
    oldPrice,
    quantity,
    checked,
    onToggleCheck,
    onIncrease,
    onDecrease,
    onRemove,
}) => {
    const totalPrice = price * quantity;
    const totalOldPrice = oldPrice ? oldPrice * quantity : undefined;

    return (
        <div className="cart-item">
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleCheck(id)}
                className="cart-checkbox"
            />

            <img src={image} alt={name} className="cart-img" />

            <div className="cart-info">
                <p className="cart-name">{name}</p>

                <div className="cart-price-row">
                    <span className="cart-price">
                        {totalPrice.toLocaleString()}đ
                    </span>

                    {totalOldPrice && (
                        <span className="cart-old-price">
                            {totalOldPrice.toLocaleString()}đ
                        </span>
                    )}
                </div>

                <div className="cart-quantity">
                    <button onClick={() => onDecrease(id)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => onIncrease(id)}>+</button>
                </div>
            </div>

            <button className="cart-delete" onClick={() => onRemove(id)}>
                🗑
            </button>
        </div>
    );
};

export default CartItem;
