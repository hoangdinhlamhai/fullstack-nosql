import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequireRole from "./components/RequireRole";
import UserLayout from "./components/layout/UserLayout";
import Layout from "./components/layout/Layout";

/* ===== USER ===== */
import Home from "./pages/Home/Home";
import LoginPage from "./pages/Login/LoginPage";
import LaptopPage from "./pages/catalog/LaptopPage";
import AccountPage from "./pages/AccountManager/Account";
import ProductDetail from "./pages/DetailProduct/DetailProductPage";
import CartPage from "./pages/CartPage/CartPage";
import OrderHistoryPage from "./pages/OrderHistory/OrderHistoryPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import OrderPage from "./pages/Order/OrderPage";

/* ===== ADMIN ===== */
import Category from "./Admin/category/category";
import Addcategory from "./Admin/category/add_category";
import UpdateDeleteCategory from "./Admin/category/update_delete_category";
import Product from "./Admin/product/product";
import AddProduct from "./Admin/product/add_product";
import UpdateDeleteProductPage  from "./Admin/product/update_delete_product";
import BrandManagement from "./Admin/brand/brand";
import AccountManagement from "./Admin/account/manage_account";
import NotificationManagement from "./Admin/notification/manage_notification";
import NotificationDetailPage from "./Admin/notification/notification_detail";
import PendingOrders from "./Admin/order/order_approval";
import OrderDetailPage from "./Admin/order/order_approval_detail";
import StockManagement from "./Admin/stock/manage_stock";
import Batch from "./Admin/stock/batch";
import StockinReceipt from "./Admin/stock/stockin_receipt";
import StockoutReceipt from "./Admin/stock/stockout_receipt";
import Sales_And_Quantity from "./Admin/statistical/sales_and_quantity";
import InventoryQuantity from "./Admin/statistical/inventory_quantity";
import OrderStatusByTime from "./Admin/statistical/order_status_by_time";
import SupplierForm from "./Admin/brand/add_brand";
import BrandEditPage from "./Admin/brand/update_delete_brand";

function App() {
  return (
    <Router>
      <Routes>

        {/* ===== USER LAYOUT ===== */}
        <Route element={<UserLayout />}>
          <Route path="/products/:id" element={<LaptopPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/laptop" element={<LaptopPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/product-detail/:id" element={<ProductDetail />} />
          <Route path="/cartShop" element={<CartPage />} />
          <Route path="/historyOrder" element={<OrderHistoryPage />} />
          <Route path="/order/:orderId" element={<OrderPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>

        {/* ===== ADMIN LAYOUT ===== */}
        <Route
          path="/admin"
          element={
            <RequireRole allow={["Admin"]}>
              <Layout />
            </RequireRole>
          }
        >
          {/* 👇 ADMIN CHILD ROUTES */}
          <Route path="products" element={<Product />} />
          <Route path="products/create" element={<AddProduct />} />
          <Route path="products/edit/:idProduct" element={<UpdateDeleteProductPage  />} />

          <Route path="category" element={<Category />} />
          <Route path="category/create" element={<Addcategory />} />
          <Route path="category/edit/:categoryId" element={<UpdateDeleteCategory />} />

          <Route path="brands" element={<BrandManagement />} />
          <Route path="brands/create" element={<SupplierForm />} />
          <Route path="brands/update/:id" element={<BrandEditPage />} />
          <Route path="manage_account" element={<AccountManagement />} />
          <Route path="manage_notification" element={<NotificationManagement />} />
          <Route path="notifications/:id" element={<NotificationDetailPage />} />

          <Route path="order_approval" element={<PendingOrders />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />

          <Route path="stock_management" element={<StockManagement />} />
          <Route path="batches" element={<Batch />} />
          <Route path="stockin_receipt" element={<StockinReceipt />} />
          <Route path="stockout_receipt" element={<StockoutReceipt />} />

          {/* <Route
            path="sales_and_quantity"
            element={
              <Sales_And_Quantity
                data={[]}
                danhSachNam={[]}
                tongDoanhThu={0}
                tongDonHang={0}
              />
            }
          /> */}
          <Route
            path="inventory_quantity"
            element={<InventoryQuantity model={[]} danhSachNam={[]} />}
          />
          <Route
            path="order_status_by_time"
            element={
              <OrderStatusByTime
                danhSachNam={[2023, 2024]}
                tongSoDon={0}
                donHoanThanh={0}
                donHuy={0}
              />
            }
          />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
