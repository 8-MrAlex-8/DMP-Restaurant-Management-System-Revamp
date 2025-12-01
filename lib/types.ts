// Database Types for DMP Restaurant Management System

export type Role = 'Cook' | 'Cashier' | 'Inventory Custodian' | 'Admin';

export interface Customer {
  customer_id?: string;
  name: string;
  contact_info: string;
  created_at?: string;
}

export interface Employee {
  employee_id?: string;
  name: string;
  role: Role;
  email: string;
  password_hash?: string;
  created_at?: string;
}

export interface Supplier {
  supplier_id?: string;
  name: string;
  contact_info: string;
  address: string;
  created_at?: string;
}

export interface MenuItem {
  menu_item_id?: string;
  name: string;
  price: number;
  unit_measure: string;
  quantity_available: number;
  created_at?: string;
}

export interface Ingredient {
  ingredient_id?: string;
  name: string;
  current_stock: number;
  reorder_point: number;
  expiry_date?: string;
  auto_order_qty: number;
  unit: string;
  created_at?: string;
}

export interface SalesTran {
  sales_tran_id?: string;
  customer_id?: string;
  employee_id?: string;
  transaction_date: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'voided';
  created_at?: string;
}

export interface SalesLineItem {
  line_item_id?: string;
  sales_tran_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderTran {
  order_tran_id?: string;
  supplier_id: string;
  order_date: string;
  expected_delivery?: string;
  status: 'pending' | 'ordered' | 'delivered' | 'cancelled';
  created_at?: string;
}

export interface OrderLineItem {
  line_item_id?: string;
  order_tran_id: string;
  ingredient_id: string;
  quantity_ordered: number;
  unit_cost: number;
}

export interface DelivTran {
  deliv_tran_id?: string;
  order_tran_id: string;
  delivery_date: string;
  received_by?: string;
  status: 'pending' | 'received';
  created_at?: string;
}

export interface DelvLineItem {
  line_item_id?: string;
  deliv_tran_id: string;
  ingredient_id: string;
  quantity_received: number;
  actual_cost: number;
}

export interface RelRecord {
  rel_record_id?: string;
  employee_id: string;
  release_date: string;
  purpose?: string;
  created_at?: string;
}

export interface RoLineItem {
  line_item_id?: string;
  rel_record_id: string;
  ingredient_id: string;
  quantity_released: number;
}



