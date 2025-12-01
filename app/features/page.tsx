import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Customers',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-[#f97316]',
      description: 'Complete customer relationship management',
      details: [
        'Create, read, update, and delete customer records',
        'Store customer contact information and preferences',
        'Track customer order history',
        'Manage customer loyalty and special requests'
      ]
    },
    {
      title: 'Employees',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-[#84cc16]',
      description: 'Employee management with role-based access control',
      details: [
        'Full CRUD operations for employee records',
        'Secure login and authentication system',
        'Role-based access: Cooks, Cashiers, Inventory Custodians',
        'Permission management per role',
        'Employee activity tracking'
      ]
    },
    {
      title: 'Suppliers',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-[#f59e0b]',
      description: 'Supplier relationship and contact management',
      details: [
        'Create and manage supplier profiles',
        'Store supplier contact information',
        'Track supplier performance and reliability',
        'Link suppliers to purchase orders'
      ]
    },
    {
      title: 'Menu Items',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-[#f97316]',
      description: 'Menu and pricing management',
      details: [
        'Create and manage menu items',
        'Set pricing and update in real-time',
        'Track quantities and availability',
        'Define unit measurements (per piece, per serving, etc.)',
        'Link menu items to required ingredients'
      ]
    },
    {
      title: 'Ingredients',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'bg-[#84cc16]',
      description: 'Advanced inventory tracking and management',
      details: [
        'Real-time inventory level tracking',
        'Expiry date monitoring and alerts',
        'Reorder point configuration',
        'Auto-order quantity settings',
        'Low stock notifications',
        'Ingredient cost tracking'
      ]
    },
    {
      title: 'Sales POS',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      color: 'bg-[#f59e0b]',
      description: 'Point of Sale transaction management',
      details: [
        'Create new sales transactions',
        'Edit pending transactions',
        'Void transactions when needed',
        'Finalize and process payments',
        'Automatic item availability checking',
        'Printed receipt simulation',
        'Customer order tracking'
      ]
    },
    {
      title: 'Deliveries',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-[#f97316]',
      description: 'Purchase order and delivery tracking',
      details: [
        'Create purchase orders from suppliers',
        'Track delivery receipts',
        'Manage delivery line items',
        'Record delivery costs and quantities',
        'Link deliveries to inventory updates',
        'Delivery status tracking'
      ]
    },
    {
      title: 'Releases',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      color: 'bg-[#84cc16]',
      description: 'Ingredient release to kitchen staff',
      details: [
        'Release ingredients to cooks',
        'Automatic stock deduction',
        'Track release records',
        'Link releases to specific orders',
        'Maintain inventory accuracy',
        'Release authorization workflow'
      ]
    },
    {
      title: 'Reports',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-[#f59e0b]',
      description: 'Comprehensive analytics and reporting',
      details: [
        'Daily sales totals and summaries',
        'Item-specific popularity reports',
        'Transaction reports within date periods',
        'Inventory usage analytics',
        'Revenue trends and patterns',
        'Exportable report formats'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#fefbf8] via-[#f5f1eb] to-[#e8e3db] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              System Features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed to manage every aspect of your restaurant operations, 
              from customer interactions to inventory control.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <span className="text-[#f97316] mr-2 mt-1">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-[#f5f1eb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Capabilities
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-[#f97316] rounded-lg flex items-center justify-center text-white mr-4">
                  1
                </span>
                Data Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Complete CRUD operations across all entities ensure you have full control over 
                your data. Create, update, and manage customers, employees, suppliers, menu items, 
                and ingredients with intuitive interfaces.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-[#84cc16] rounded-lg flex items-center justify-center text-white mr-4">
                  2
                </span>
                Real-Time Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor inventory levels, track sales transactions, and manage deliveries in real-time. 
                Automatic stock updates ensure your data is always current and accurate.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-[#f59e0b] rounded-lg flex items-center justify-center text-white mr-4">
                  3
                </span>
                Workflow Automation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Streamlined processes for ingredient releases, purchase orders, and sales transactions 
                reduce manual work and minimize errors. Role-based access ensures proper authorization.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-[#f97316] rounded-lg flex items-center justify-center text-white mr-4">
                  4
                </span>
                Business Intelligence
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive reporting tools provide insights into sales trends, popular items, 
                and inventory usage. Make data-driven decisions to optimize your operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Explore the System Architecture
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Understand how these features work together through our database model and system flows.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/database"
              className="px-8 py-3 bg-white text-[#f97316] rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              View Database Model
            </Link>
            <Link
              href="/system-flow"
              className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              See System Flow
            </Link>
          </div>
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

