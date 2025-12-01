import supabase from './supabaseClient';
import type {
  Customer,
  Employee,
  Supplier,
  MenuItem,
  Ingredient,
  SalesTran,
  SalesLineItem,
  OrderTran,
  OrderLineItem,
  DelivTran,
  DelvLineItem,
  RelRecord,
  RoLineItem,
} from './types';

// Customer operations
export const customerDb = {
  getAll: async () => {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Customer[];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from('customers').select('*').eq('customer_id', id).single();
    if (error) throw error;
    return data as Customer;
  },
  create: async (customer: Omit<Customer, 'customer_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('customers').insert(customer).select().single();
    if (error) throw error;
    return data as Customer;
  },
  update: async (id: string, customer: Partial<Customer>) => {
    const { data, error } = await supabase.from('customers').update(customer).eq('customer_id', id).select().single();
    if (error) throw error;
    return data as Customer;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('customers').delete().eq('customer_id', id);
    if (error) throw error;
  },
};

// Employee operations
export const employeeDb = {
  getAll: async () => {
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Employee[];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from('employees').select('*').eq('employee_id', id).single();
    if (error) throw error;
    return data as Employee;
  },
  create: async (employee: Omit<Employee, 'employee_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('employees').insert(employee).select().single();
    if (error) throw error;
    return data as Employee;
  },
  update: async (id: string, employee: Partial<Employee>) => {
    const { data, error } = await supabase.from('employees').update(employee).eq('employee_id', id).select().single();
    if (error) throw error;
    return data as Employee;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('employees').delete().eq('employee_id', id);
    if (error) throw error;
  },
};

// Supplier operations
export const supplierDb = {
  getAll: async () => {
    const { data, error } = await supabase.from('suppliers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Supplier[];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from('suppliers').select('*').eq('supplier_id', id).single();
    if (error) throw error;
    return data as Supplier;
  },
  create: async (supplier: Omit<Supplier, 'supplier_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('suppliers').insert(supplier).select().single();
    if (error) throw error;
    return data as Supplier;
  },
  update: async (id: string, supplier: Partial<Supplier>) => {
    const { data, error } = await supabase.from('suppliers').update(supplier).eq('supplier_id', id).select().single();
    if (error) throw error;
    return data as Supplier;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('suppliers').delete().eq('supplier_id', id);
    if (error) throw error;
  },
};

// Menu Item operations
export const menuItemDb = {
  getAll: async () => {
    const { data, error } = await supabase.from('menu_items').select('*').order('name', { ascending: true });
    if (error) throw error;
    return data as MenuItem[];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from('menu_items').select('*').eq('menu_item_id', id).single();
    if (error) throw error;
    return data as MenuItem;
  },
  create: async (item: Omit<MenuItem, 'menu_item_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('menu_items').insert(item).select().single();
    if (error) throw error;
    return data as MenuItem;
  },
  update: async (id: string, item: Partial<MenuItem>) => {
    const { data, error } = await supabase.from('menu_items').update(item).eq('menu_item_id', id).select().single();
    if (error) throw error;
    return data as MenuItem;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('menu_items').delete().eq('menu_item_id', id);
    if (error) throw error;
  },
};

// Ingredient operations
export const ingredientDb = {
  getAll: async () => {
    const { data, error } = await supabase.from('ingredients').select('*').order('name', { ascending: true });
    if (error) throw error;
    return data as Ingredient[];
  },
  getById: async (id: string) => {
    const { data, error } = await supabase.from('ingredients').select('*').eq('ingredient_id', id).single();
    if (error) throw error;
    return data as Ingredient;
  },
  create: async (ingredient: Omit<Ingredient, 'ingredient_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('ingredients').insert(ingredient).select().single();
    if (error) throw error;
    return data as Ingredient;
  },
  update: async (id: string, ingredient: Partial<Ingredient>) => {
    const { data, error } = await supabase.from('ingredients').update(ingredient).eq('ingredient_id', id).select().single();
    if (error) throw error;
    return data as Ingredient;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('ingredients').delete().eq('ingredient_id', id);
    if (error) throw error;
  },
  getLowStock: async () => {
    const { data, error } = await supabase.from('ingredients').select('*');
    if (error) throw error;
    return (data as Ingredient[]).filter((ing) => ing.current_stock <= ing.reorder_point);
  },
};

// Sales Transaction operations
export const salesTranDb = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('sales_tran')
      .select('*, customers(*), employees(*)')
      .order('transaction_date', { ascending: false });
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('sales_tran')
      .select('*, customers(*), employees(*), sales_line_item(*, menu_items(*))')
      .eq('sales_tran_id', id)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (tran: Omit<SalesTran, 'sales_tran_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('sales_tran').insert(tran).select().single();
    if (error) throw error;
    return data as SalesTran;
  },
  update: async (id: string, tran: Partial<SalesTran>) => {
    const { data, error } = await supabase.from('sales_tran').update(tran).eq('sales_tran_id', id).select().single();
    if (error) throw error;
    return data as SalesTran;
  },
  void: async (id: string) => {
    const { data, error } = await supabase.from('sales_tran').update({ status: 'voided' }).eq('sales_tran_id', id).select().single();
    if (error) throw error;
    return data as SalesTran;
  },
};

// Sales Line Item operations
export const salesLineItemDb = {
  getByTransaction: async (tranId: string) => {
    const { data, error } = await supabase
      .from('sales_line_item')
      .select('*, menu_items(*)')
      .eq('sales_tran_id', tranId);
    if (error) throw error;
    return data;
  },
  create: async (item: Omit<SalesLineItem, 'line_item_id'>) => {
    const { data, error } = await supabase.from('sales_line_item').insert(item).select().single();
    if (error) throw error;
    return data as SalesLineItem;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('sales_line_item').delete().eq('line_item_id', id);
    if (error) throw error;
  },
};

// Purchase Order operations
export const orderTranDb = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('order_tran')
      .select('*, suppliers(*)')
      .order('order_date', { ascending: false });
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('order_tran')
      .select('*, suppliers(*), order_line_item(*, ingredients(*))')
      .eq('order_tran_id', id)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (order: Omit<OrderTran, 'order_tran_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('order_tran').insert(order).select().single();
    if (error) throw error;
    return data as OrderTran;
  },
  update: async (id: string, order: Partial<OrderTran>) => {
    const { data, error } = await supabase.from('order_tran').update(order).eq('order_tran_id', id).select().single();
    if (error) throw error;
    return data as OrderTran;
  },
};

// Order Line Item operations
export const orderLineItemDb = {
  getByOrder: async (orderId: string) => {
    const { data, error } = await supabase
      .from('order_line_item')
      .select('*, ingredients(*)')
      .eq('order_tran_id', orderId);
    if (error) throw error;
    return data;
  },
  create: async (item: Omit<OrderLineItem, 'line_item_id'>) => {
    const { data, error } = await supabase.from('order_line_item').insert(item).select().single();
    if (error) throw error;
    return data as OrderLineItem;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('order_line_item').delete().eq('line_item_id', id);
    if (error) throw error;
  },
};

// Delivery operations
export const delivTranDb = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('deliv_tran')
      .select('*, order_tran(*, suppliers(*))')
      .order('delivery_date', { ascending: false });
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('deliv_tran')
      .select('*, order_tran(*), delv_line_item(*, ingredients(*))')
      .eq('deliv_tran_id', id)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (deliv: Omit<DelivTran, 'deliv_tran_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('deliv_tran').insert(deliv).select().single();
    if (error) throw error;
    return data as DelivTran;
  },
  update: async (id: string, deliv: Partial<DelivTran>) => {
    const { data, error } = await supabase.from('deliv_tran').update(deliv).eq('deliv_tran_id', id).select().single();
    if (error) throw error;
    return data as DelivTran;
  },
};

// Delivery Line Item operations
export const delvLineItemDb = {
  getByDelivery: async (delivId: string) => {
    const { data, error } = await supabase
      .from('delv_line_item')
      .select('*, ingredients(*)')
      .eq('deliv_tran_id', delivId);
    if (error) throw error;
    return data;
  },
  create: async (item: Omit<DelvLineItem, 'line_item_id'>) => {
    const { data, error } = await supabase.from('delv_line_item').insert(item).select().single();
    if (error) throw error;
    return data as DelvLineItem;
  },
};

// Release Record operations
export const relRecordDb = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('rel_record')
      .select('*, employees(*)')
      .order('release_date', { ascending: false });
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('rel_record')
      .select('*, employees(*), ro_line_item(*, ingredients(*))')
      .eq('rel_record_id', id)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (record: Omit<RelRecord, 'rel_record_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('rel_record').insert(record).select().single();
    if (error) throw error;
    return data as RelRecord;
  },
};

// Release Line Item operations
export const roLineItemDb = {
  getByRelease: async (relId: string) => {
    const { data, error } = await supabase
      .from('ro_line_item')
      .select('*, ingredients(*)')
      .eq('rel_record_id', relId);
    if (error) throw error;
    return data;
  },
  create: async (item: Omit<RoLineItem, 'line_item_id'>) => {
    const { data, error } = await supabase.from('ro_line_item').insert(item).select().single();
    if (error) throw error;
    return data as RoLineItem;
  },
};

