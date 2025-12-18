// src/services/PaymentService.ts
import axios from "axios";

const API_URL = "http://localhost:8080/paypal";

const PaymentService = {
  createPayPalPayment: async (orderId: string) => {
    const res = await axios.post(
      `${API_URL}/create`,
      null,
      {
        params: { orderId }
      }
    );

    return res.data; // { approvalUrl }
  },

  getPaymentByOrderId: async (orderId: string) => {
    const res = await axios.get(`${API_URL}/payment/${orderId}`);
    return res.data;
  }
};

export default PaymentService;
