# DMP Restaurant Management System - Setup Guide

## Overview

This is a complete restaurant management application built with Next.js, React, TypeScript, and Supabase. It includes all the features needed to manage a restaurant operation:

- Customer management
- Employee management with role-based access
- Supplier management
- Menu item management
- Ingredient inventory tracking
- POS (Point of Sale) system
- Purchase orders and deliveries
- Ingredient releases
- Reports and analytics

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from the Supabase dashboard
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Database Tables

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL script to create all tables

### 4. Run the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Application Features

### Dashboard
- Overview statistics (customers, sales, transactions, low stock alerts)
- Quick access to main features

### Customers
- Create, read, update, delete customer records
- Track customer information and contact details

### Employees
- Manage employee records
- Role-based access: Cook, Cashier, Inventory Custodian, Admin
- Email and password management

### Suppliers
- Manage supplier information
- Contact details and addresses

### Menu Items
- Create and manage menu items
- Set prices and track availability
- Unit measurements

### Inventory (Ingredients)
- Track ingredient stock levels
- Set reorder points and auto-order quantities
- Expiry date tracking
- Low stock alerts

### POS Sales
- Create sales transactions
- Select customers and employees
- Add menu items to cart
- Real-time stock checking
- Process payments and generate transactions

### Purchases
- Create purchase orders from suppliers
- Track expected deliveries
- Record actual deliveries
- Automatically update inventory on delivery

### Releases
- Record ingredient releases to cooks
- Automatic stock deduction
- Track release purposes

### Reports
- Sales summaries by date range
- Item popularity rankings
- Daily sales breakdown
- Transaction history

## Database Schema

The application uses the following main tables:

- `customers` - Customer information
- `employees` - Employee records with roles
- `suppliers` - Supplier information
- `menu_items` - Menu items with pricing
- `ingredients` - Ingredient inventory
- `sales_tran` - Sales transaction headers
- `sales_line_item` - Sales transaction line items
- `order_tran` - Purchase order headers
- `order_line_item` - Purchase order line items
- `deliv_tran` - Delivery receipt headers
- `delv_line_item` - Delivery receipt line items
- `rel_record` - Ingredient release records
- `ro_line_item` - Release line items

## Notes

- The application assumes you have proper Supabase Row Level Security (RLS) policies set up, or that you're using service role keys for development
- Password hashing should be implemented properly in production (currently stored as plain text for development)
- The application uses UUIDs for all primary keys
- All timestamps are stored in UTC

## Troubleshooting

If you encounter errors:

1. Make sure all database tables are created
2. Verify your Supabase credentials in `.env.local`
3. Check browser console for specific error messages
4. Ensure Supabase RLS policies allow the operations you're trying to perform



