import Link from 'next/link';

export default function DatabasePage() {
  const tables = [
    {
      name: 'Customers',
      fields: ['customer_id (PK)', 'name', 'contact_info', 'created_at'],
      description: 'Stores customer information and contact details'
    },
    {
      name: 'Employees',
      fields: ['employee_id (PK)', 'name', 'role', 'login_credentials', 'permissions'],
      description: 'Employee records with role-based access control'
    },
    {
      name: 'Suppliers',
      fields: ['supplier_id (PK)', 'name', 'contact_info', 'address'],
      description: 'Supplier information and contact details'
    },
    {
      name: 'Menu_Items',
      fields: ['menu_item_id (PK)', 'name', 'price', 'unit_measure', 'quantity_available'],
      description: 'Menu items with pricing and availability'
    },
    {
      name: 'Ingredients',
      fields: ['ingredient_id (PK)', 'name', 'current_stock', 'reorder_point', 'expiry_date', 'auto_order_qty'],
      description: 'Ingredient inventory with tracking and reorder management'
    },
    {
      name: 'Sales_Tran',
      fields: ['sales_tran_id (PK)', 'customer_id (FK)', 'employee_id (FK)', 'transaction_date', 'total_amount', 'status'],
      description: 'Sales transaction header records'
    },
    {
      name: 'Sales_Line_Item',
      fields: ['line_item_id (PK)', 'sales_tran_id (FK)', 'menu_item_id (FK)', 'quantity', 'unit_price', 'subtotal'],
      description: 'Individual items within a sales transaction'
    },
    {
      name: 'Order_Tran',
      fields: ['order_tran_id (PK)', 'supplier_id (FK)', 'order_date', 'expected_delivery', 'status'],
      description: 'Purchase order transaction headers'
    },
    {
      name: 'Order_Line_Item',
      fields: ['line_item_id (PK)', 'order_tran_id (FK)', 'ingredient_id (FK)', 'quantity_ordered', 'unit_cost'],
      description: 'Line items for purchase orders'
    },
    {
      name: 'Deliv_Tran',
      fields: ['deliv_tran_id (PK)', 'order_tran_id (FK)', 'delivery_date', 'received_by', 'status'],
      description: 'Delivery receipt transaction headers'
    },
    {
      name: 'Delv_Line_Item',
      fields: ['line_item_id (PK)', 'deliv_tran_id (FK)', 'ingredient_id (FK)', 'quantity_received', 'actual_cost'],
      description: 'Line items for delivery receipts'
    },
    {
      name: 'Rel_Record',
      fields: ['rel_record_id (PK)', 'employee_id (FK)', 'release_date', 'purpose'],
      description: 'Ingredient release record headers'
    },
    {
      name: 'Ro_Line_Item',
      fields: ['line_item_id (PK)', 'rel_record_id (FK)', 'ingredient_id (FK)', 'quantity_released'],
      description: 'Line items for ingredient releases'
    }
  ];

  const relationships = [
    {
      from: 'Sales_Tran',
      to: 'Customers',
      type: 'Many-to-One',
      description: 'Multiple sales transactions can belong to one customer'
    },
    {
      from: 'Sales_Tran',
      to: 'Employees',
      type: 'Many-to-One',
      description: 'Multiple sales transactions can be processed by one employee'
    },
    {
      from: 'Sales_Line_Item',
      to: 'Sales_Tran',
      type: 'Many-to-One',
      description: 'Multiple line items belong to one sales transaction'
    },
    {
      from: 'Sales_Line_Item',
      to: 'Menu_Items',
      type: 'Many-to-One',
      description: 'Multiple line items can reference the same menu item'
    },
    {
      from: 'Order_Tran',
      to: 'Suppliers',
      type: 'Many-to-One',
      description: 'Multiple purchase orders can be from one supplier'
    },
    {
      from: 'Order_Line_Item',
      to: 'Order_Tran',
      type: 'Many-to-One',
      description: 'Multiple line items belong to one purchase order'
    },
    {
      from: 'Order_Line_Item',
      to: 'Ingredients',
      type: 'Many-to-One',
      description: 'Multiple order line items can reference the same ingredient'
    },
    {
      from: 'Deliv_Tran',
      to: 'Order_Tran',
      type: 'One-to-One',
      description: 'One delivery receipt corresponds to one purchase order'
    },
    {
      from: 'Delv_Line_Item',
      to: 'Deliv_Tran',
      type: 'Many-to-One',
      description: 'Multiple line items belong to one delivery transaction'
    },
    {
      from: 'Delv_Line_Item',
      to: 'Ingredients',
      type: 'Many-to-One',
      description: 'Multiple delivery line items can reference the same ingredient'
    },
    {
      from: 'Rel_Record',
      to: 'Employees',
      type: 'Many-to-One',
      description: 'Multiple release records can be created by one employee'
    },
    {
      from: 'Ro_Line_Item',
      to: 'Rel_Record',
      type: 'Many-to-One',
      description: 'Multiple line items belong to one release record'
    },
    {
      from: 'Ro_Line_Item',
      to: 'Ingredients',
      type: 'Many-to-One',
      description: 'Multiple release line items can reference the same ingredient'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#fefbf8] via-[#f5f1eb] to-[#e8e3db] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Database Schema & ERD
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive relational database structure designed to support all aspects 
              of restaurant operations, from customer management to inventory tracking.
            </p>
          </div>
        </div>
      </section>

      {/* ERD Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Entity Relationship Diagram</h2>
            <div className="bg-[#f5f1eb] rounded-xl p-8 overflow-x-auto">
              <div className="min-w-full">
                {/* Simplified ERD Visualization */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Core Entities */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border-2 border-[#f97316]">
                      <h3 className="font-bold text-[#f97316] mb-2">Core Entities</h3>
                      <div className="text-sm space-y-1">
                        <div>• Customers</div>
                        <div>• Employees</div>
                        <div>• Suppliers</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border-2 border-[#84cc16]">
                      <h3 className="font-bold text-[#84cc16] mb-2">Product Entities</h3>
                      <div className="text-sm space-y-1">
                        <div>• Menu_Items</div>
                        <div>• Ingredients</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border-2 border-[#f59e0b]">
                      <h3 className="font-bold text-[#f59e0b] mb-2">Transaction Entities</h3>
                      <div className="text-sm space-y-1">
                        <div>• Sales_Tran</div>
                        <div>• Order_Tran</div>
                        <div>• Deliv_Tran</div>
                        <div>• Rel_Record</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Relationship Lines (Visual Representation) */}
                <div className="mt-8 pt-8 border-t border-gray-300">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center">
                      <span className="w-24 font-semibold">Sales Flow:</span>
                      <span>Customers → Sales_Tran → Sales_Line_Item → Menu_Items</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 font-semibold">Purchase Flow:</span>
                      <span>Suppliers → Order_Tran → Order_Line_Item → Ingredients</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 font-semibold">Delivery Flow:</span>
                      <span>Order_Tran → Deliv_Tran → Delv_Line_Item → Ingredients</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 font-semibold">Release Flow:</span>
                      <span>Employees → Rel_Record → Ro_Line_Item → Ingredients</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database Tables */}
      <section className="py-20 bg-[#f5f1eb]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Database Tables</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3 ${
                    table.name.includes('Sales') ? 'bg-[#f97316]' :
                    table.name.includes('Order') || table.name.includes('Deliv') ? 'bg-[#84cc16]' :
                    table.name.includes('Rel') ? 'bg-[#f59e0b]' :
                    'bg-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  {table.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{table.description}</p>
                <div className="bg-[#f5f1eb] rounded-lg p-4">
                  <div className="text-xs font-mono space-y-1">
                    {table.fields.map((field, idx) => (
                      <div key={idx} className="text-gray-700">
                        {field.includes('(PK)') ? (
                          <span className="text-[#f97316] font-semibold">🔑 {field}</span>
                        ) : field.includes('(FK)') ? (
                          <span className="text-[#84cc16] font-semibold">🔗 {field}</span>
                        ) : (
                          <span>• {field}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Relationships */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Table Relationships</h2>
          
          <div className="bg-[#f5f1eb] rounded-xl p-8">
            <div className="space-y-4">
              {relationships.map((rel, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900">{rel.from}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-bold text-gray-900">{rel.to}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rel.type === 'Many-to-One' ? 'bg-[#84cc16] text-white' :
                          rel.type === 'One-to-One' ? 'bg-[#f97316] text-white' :
                          'bg-[#f59e0b] text-white'
                        }`}>
                          {rel.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{rel.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Concepts */}
      <section className="py-20 bg-[#f5f1eb]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Database Design Principles</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-10 h-10 bg-[#f97316] rounded-lg flex items-center justify-center text-white mr-4">
                  PK
                </span>
                Primary Keys
              </h3>
              <p className="text-gray-600">
                Each table has a unique primary key (PK) that uniquely identifies each record. 
                This ensures data integrity and enables efficient querying.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-10 h-10 bg-[#84cc16] rounded-lg flex items-center justify-center text-white mr-4">
                  FK
                </span>
                Foreign Keys
              </h3>
              <p className="text-gray-600">
                Foreign keys (FK) establish relationships between tables, maintaining referential 
                integrity and enabling complex queries across related data.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-10 h-10 bg-[#f59e0b] rounded-lg flex items-center justify-center text-white mr-4">
                  →
                </span>
                Normalization
              </h3>
              <p className="text-gray-600">
                The database follows normalization principles to eliminate redundancy, ensure 
                data consistency, and optimize storage efficiency.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-10 h-10 bg-[#f97316] rounded-lg flex items-center justify-center text-white mr-4">
                  ⚡
                </span>
                Transaction Support
              </h3>
              <p className="text-gray-600">
                Transaction tables (Sales_Tran, Order_Tran, etc.) support ACID properties, 
                ensuring data consistency during complex operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            See How It All Works Together
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Explore the system flows to understand how these database tables interact in real-world scenarios.
          </p>
          <Link
            href="/system-flow"
            className="inline-block px-8 py-3 bg-white text-[#f97316] rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            View System Flow
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg font-semibold text-white mb-2">DMP Restaurant Management System</p>
          <p className="text-sm">All-in-one restaurant POS and inventory management platform</p>
        </div>
      </footer>
    </div>
  );
}

