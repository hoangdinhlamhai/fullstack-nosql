export interface LoginResponse {
    token: string;
    id: number;
    phone_number: string;
    roles_id: number;
    address: string;
    full_name: string;
    status: boolean;
}

export interface IRegisterRequest {
    full_name: string;
    phone_number: string;
    password: string;
    retype_pass: string;
    roles_id: number;
}

export interface IRole {
    roleId: number;
    roleName: string;
}

export interface IUser {
    userID: number;
    sdt?: string;
    fullName?: string;
    email?: string;
    address?: string;
    avatar?: string;
    password?: string;
    googleId?: string;
    roleId: number;
}

export interface ICategory {
    categoryID: number;
    categoryName: string;
    description?: string;
}

export interface ISpecification {
    specID: number | null;
    screen?: string;
    cpu?: string;
    ram?: string;
    storage?: string;
    camera?: string;
    battery?: string;
    os?: string;
}

// export interface IProduct {
//     productID: number;
//     name: string;
//     price: number;
//     stock_quantity: number;
//     image_url?: string;
//     description?: string;
//     created_at?: string;
//     updated_at?: string;

//     categoryID?: number;
//     brandID?: number;
//     specID?: number;
// }
export interface IProductImage {
    id: string | null;
    url: string;
    img_index: number;
}

export interface IProduct {
    productId: string;      // Khác với 'productID' cũ [1]
    name: string;
    price: number;
    stockQuantity: number;  // Khác với 'stock_quantity' cũ [1]
    description: string;
    brandId: string;
    categoryId: string;
    specification: ISpecification;
    productImages: IProductImage[]; // Khác với 'image_url' cũ [1]
}

export interface CartProduct {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    quantity: number;
    checked: boolean;
}

export interface IOrder {
  orderId: string;
  orderDate: string;
  status: string;
  paymentStatus: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}


export interface IOrderDetail {
  id?: string;        // optional (Mongo _id)
  orderId: string;
  productId: string;
  quantity: number;
}


export interface IReview {
    reviewID: number;
    orderID: number;

    comment?: string;
    video?: string;
    photo?: string;
}

export interface CreateOrderRequest {
  orderDate: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID";
  userId: string;
}

export interface CreateOrderDetailRequest {
  orderId: string;
  productId: string;
  quantity: number;
}

interface OrderDetailItem {
  id: string;
  quantity: number;
  product: IProduct;
}

export interface PayPalPaymentRequest {
    localOrderId: string;
    amount: number;
    currency: string;
    description: string;
}

export interface PayPalCreateResponse {
    approvalUrl: string;
}

