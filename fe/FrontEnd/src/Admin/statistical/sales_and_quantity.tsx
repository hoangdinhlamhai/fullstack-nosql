import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Chart from "chart.js/auto";
import styles from "./sales_and_quantity.module.css";

/* ===== TYPES ===== */
interface Order {
  orderId: string;
  orderDate: string;
  status: string;
  paymentStatus: string;
}

interface OrderDetail {
  orderId: string;
  productId: string;
  quantity: number;
}

interface Product {
  id: string;
  price: number;
}

interface ThongKeItem {
  thang: number;
  soLuong: number;
  doanhThu: number;
}

/* ================================================= */
const Sales_And_Quantity: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const [data, setData] = useState<ThongKeItem[]>([]);
  const [tongDoanhThu, setTongDoanhThu] = useState(0);
  const [tongDonHang, setTongDonHang] = useState(0);
  const [danhSachNam, setDanhSachNam] = useState<number[]>([]);

  /* ===== FILTER PARAMS (init from URL) ===== */
  const [year, setYear] = useState<number | "">(
    searchParams.get("nam") ? Number(searchParams.get("nam")) : ""
  );
  const [month, setMonth] = useState<number | "">(
    searchParams.get("thang") ? Number(searchParams.get("thang")) : ""
  );
  const [day, setDay] = useState<number | "">(
    searchParams.get("ngay") ? Number(searchParams.get("ngay")) : ""
  );

  /* ===== FETCH & CALCULATE (FE HANDLE ALL) ===== */
  useEffect(() => {
    if (!year) return;

    const fetchAndCalc = async () => {
      try {
        const [orderRes, detailRes, productRes] = await Promise.all([
          fetch("http://localhost:8080/api/order"),
          fetch("http://localhost:8080/api/order-details"),
          fetch("http://localhost:8080/api/products"),
        ]);

        if (!orderRes.ok || !detailRes.ok || !productRes.ok) {
          throw new Error("Fetch data failed");
        }

        const orders: Order[] = await orderRes.json();
        const details: OrderDetail[] = await detailRes.json();
        const productsRaw = await productRes.json();

        const products: Product[] = productsRaw.map((p: any) => ({
          id: p.id || p._id,
          price: p.price ?? 0,
        }));

        /* MAP productId -> price */
        const priceMap = new Map<string, number>();
        products.forEach((p) => priceMap.set(p.id, p.price));

        /* INIT 12 MONTH */
        const thongKe: ThongKeItem[] = Array.from({ length: 12 }, (_, i) => ({
          thang: i + 1,
          soLuong: 0,
          doanhThu: 0,
        }));

        const validOrders = orders.filter((o) => {
          const date = new Date(o.orderDate);
          return (
            date.getFullYear() === year &&
            o.status === "COMPLETED" &&
            o.paymentStatus === "PAID" &&
            (!month || date.getMonth() + 1 === month) &&
            (!day || date.getDate() === day)
          );
        });

        for (const order of validOrders) {
          const mIndex = new Date(order.orderDate).getMonth();
          thongKe[mIndex].soLuong += 1;

          const ods = details.filter((d) => d.orderId === order.orderId);
          for (const d of ods) {
            const price = priceMap.get(d.productId) ?? 0;
            thongKe[mIndex].doanhThu += d.quantity * price;
          }
        }

        setData(thongKe);
        setTongDoanhThu(thongKe.reduce((s, i) => s + i.doanhThu, 0));
        setTongDonHang(thongKe.reduce((s, i) => s + i.soLuong, 0));

        const years = Array.from(
          new Set(orders.map((o) => new Date(o.orderDate).getFullYear()))
        ).sort((a, b) => b - a);

        setDanhSachNam(years);
      } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu thống kê");
      }
    };

    fetchAndCalc();
  }, [year, month, day]);

  /* ===== CHART DATA ===== */
  const labels = useMemo(
    () => data.map((item) => `Tháng ${item.thang}`),
    [data]
  );

  const soLuongData = useMemo(
    () => data.map((item) => item.soLuong),
    [data]
  );

  const doanhThuData = useMemo(
    () => data.map((item) => item.doanhThu),
    [data]
  );

  /* ===== UPDATE URL WHEN FILTER CHANGE ===== */
  useEffect(() => {
    if (!year) return;

    const params = new URLSearchParams();
    params.set("nam", String(year));
    if (month) params.set("thang", String(month));
    if (day) params.set("ngay", String(day));

    navigate(`/thongke/doanhthu-donhang?${params.toString()}`, {
      replace: true,
    });
  }, [year, month, day, navigate]);

  /* ===== INIT / UPDATE CHART ===== */
  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current?.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Số lượng đơn",
            data: soLuongData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const i = ctx.dataIndex;
                return [
                  `Số lượng: ${soLuongData[i]} đơn`,
                  `Doanh thu: ${doanhThuData[i].toLocaleString("vi-VN")} VNĐ`,
                ];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [labels, soLuongData, doanhThuData]);

  /* ================= RENDER (GIỮ NGUYÊN UI) ================= */
  return (
    <main className={styles["main-content"]}>
      <div className={styles.Title}>
        <h1>THỐNG KÊ</h1>
      </div>

      <div className={styles.filters}>
        <select value={year} onChange={(e) => setYear(Number(e.target.value) || "")}>
          <option value="">-- Chọn năm --</option>
          {danhSachNam.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={month}
          disabled={!year}
          onChange={(e) => setMonth(Number(e.target.value) || "")}
        >
          <option value="">-- Không chọn tháng --</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <select
          value={day}
          disabled={!year}
          onChange={(e) => setDay(Number(e.target.value) || "")}
        >
          <option value="">-- Không chọn ngày --</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Ngày {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className={styles["stats-container"]}>
        <nav className={styles["stats-nav"]}>
          <button className={styles.active}>
            Thống kê số lượng đơn hàng và doanh thu
          </button>
          <button onClick={() => navigate("/admin/inventory_quantity")}>
            Thống kê số lượng tồn kho
          </button>
          <button onClick={() => navigate("/admin/order_status_by_time")}>
            Đơn hàng đã hủy / hoàn thành
          </button>
        </nav>

        <div className={styles["summary-stats"]}>
          <div className={styles["summary-item"]}>
            <h2>Tổng doanh thu</h2>
            <p className={styles.green}>
              {tongDoanhThu.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>

          <div className={styles["summary-item"]}>
            <h2>Tổng số đơn</h2>
            <p className={styles.red}>
              {tongDonHang.toLocaleString("vi-VN")} đơn
            </p>
          </div>
        </div>

        <p className={styles["unit-text"]}>Đơn vị tính: Đơn</p>

        <div className={styles["chart-container"]}>
          <div className={styles["chart-wrapper"]}>
            <canvas ref={chartRef} width={800} height={400}></canvas>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Sales_And_Quantity;
