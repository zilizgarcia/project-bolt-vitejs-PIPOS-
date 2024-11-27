export interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  minStock: number;
  price: number;
}

export interface Order {
  id: number;
  customerName: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface ProductionOrder {
  id: number;
  status: 'pending' | 'in-progress' | 'completed';
  products: Array<{
    productId: number;
    quantity: number;
  }>;
  priority: number;
  requiredBy: string;
  assignedTo?: number;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  shift: string;
  available: boolean;
}