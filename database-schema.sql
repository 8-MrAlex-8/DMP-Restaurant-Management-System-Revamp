-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  customer_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  employee_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Cook', 'Cashier', 'Inventory Custodian', 'Admin')),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_info TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  menu_item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  unit_measure VARCHAR(50),
  quantity_available INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingredients Table
CREATE TABLE IF NOT EXISTS ingredients (
  ingredient_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  current_stock DECIMAL(10, 2) DEFAULT 0,
  reorder_point DECIMAL(10, 2) DEFAULT 0,
  expiry_date DATE,
  auto_order_qty DECIMAL(10, 2) DEFAULT 0,
  unit VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Transactions Table
CREATE TABLE IF NOT EXISTS sales_tran (
  sales_tran_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(customer_id) ON DELETE SET NULL,
  employee_id UUID REFERENCES employees(employee_id) ON DELETE SET NULL,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'voided')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Line Items Table
CREATE TABLE IF NOT EXISTS sales_line_item (
  line_item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sales_tran_id UUID NOT NULL REFERENCES sales_tran(sales_tran_id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(menu_item_id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

-- Purchase Order Transactions Table
CREATE TABLE IF NOT EXISTS order_tran (
  order_tran_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
  order_date DATE NOT NULL,
  expected_delivery DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'ordered', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Line Items Table
CREATE TABLE IF NOT EXISTS order_line_item (
  line_item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_tran_id UUID NOT NULL REFERENCES order_tran(order_tran_id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
  quantity_ordered DECIMAL(10, 2) NOT NULL,
  unit_cost DECIMAL(10, 2) NOT NULL
);

-- Delivery Transactions Table
CREATE TABLE IF NOT EXISTS deliv_tran (
  deliv_tran_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_tran_id UUID NOT NULL REFERENCES order_tran(order_tran_id) ON DELETE CASCADE,
  delivery_date DATE NOT NULL,
  received_by VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'received')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery Line Items Table
CREATE TABLE IF NOT EXISTS delv_line_item (
  line_item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deliv_tran_id UUID NOT NULL REFERENCES deliv_tran(deliv_tran_id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
  quantity_received DECIMAL(10, 2) NOT NULL,
  actual_cost DECIMAL(10, 2) NOT NULL
);

-- Release Records Table
CREATE TABLE IF NOT EXISTS rel_record (
  rel_record_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  release_date DATE NOT NULL,
  purpose TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Release Order Line Items Table
CREATE TABLE IF NOT EXISTS ro_line_item (
  line_item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rel_record_id UUID NOT NULL REFERENCES rel_record(rel_record_id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
  quantity_released DECIMAL(10, 2) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_tran_date ON sales_tran(transaction_date);
CREATE INDEX IF NOT EXISTS idx_sales_tran_customer ON sales_tran(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_tran_employee ON sales_tran(employee_id);
CREATE INDEX IF NOT EXISTS idx_sales_line_item_tran ON sales_line_item(sales_tran_id);
CREATE INDEX IF NOT EXISTS idx_order_tran_supplier ON order_tran(supplier_id);
CREATE INDEX IF NOT EXISTS idx_order_tran_date ON order_tran(order_date);
CREATE INDEX IF NOT EXISTS idx_ingredients_stock ON ingredients(current_stock);
CREATE INDEX IF NOT EXISTS idx_deliv_tran_order ON deliv_tran(order_tran_id);
CREATE INDEX IF NOT EXISTS idx_rel_record_employee ON rel_record(employee_id);


