import React from "react";
import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";
import type { CartProduct } from "../../services/Interface";

const Checkout: React.FC = () => {
    const location = useLocation();
    const selectedItems: CartProduct[] = location.state?.selected ?? [];

    const total = selectedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    const qrValue = JSON.stringify({
        amount: total,
        products: selectedItems.map(i => ({
            id: i.id,
            quantity: i.quantity
        }))
    });

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Thanh toán QR</h2>
            <p>Tổng tiền: <strong>{total.toLocaleString()}đ</strong></p>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                <QRCode value={qrValue} size={250} />
            </div>

            <p style={{ marginTop: 20, color: "#666" }}>
                Quét mã bằng App ngân hàng để thanh toán.
            </p>
        </div>
    );
};

export default Checkout;
