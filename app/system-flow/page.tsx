import Link from 'next/link';

export default function SystemFlowPage() {
  const workflows = [
    {
      title: 'Customer Purchase Flow',
      steps: [
        { number: 1, title: 'Customer Places Order', description: 'Customer selects menu items at POS' },
        { number: 2, title: 'Check Availability', description: 'System verifies menu item availability' },
        { number: 3, title: 'Create Sales Transaction', description: 'Cashier creates Sales_Tran record' },
        { number: 4, title: 'Add Line Items', description: 'System creates Sales_Line_Item records' },
        { number: 5, title: 'Calculate Total', description: 'System calculates total amount' },
        { number: 6, title: 'Process Payment', description: 'Customer pays, transaction finalized' },
        { number: 7, title: 'Generate Receipt', description: 'System generates and prints receipt' }
      ],
      color: 'bg-[#f97316]'
    },
    {
      title: 'Employee Roles & Access',
      steps: [
        { number: 1, title: 'Employee Login', description: 'Employee authenticates with credentials' },
        { number: 2, title: 'Role Verification', description: 'System checks employee role' },
        { number: 3, title: 'Permission Check', description: 'System validates role permissions' },
        { number: 4, title: 'Access Granted', description: 'Employee accesses allowed features' },
        { number: 5, title: 'Activity Logging', description: 'System logs employee actions' }
      ],
      color: 'bg-[#84cc16]'
    },
    {
      title: 'Ingredient Ordering & Delivery',
      steps: [
        { number: 1, title: 'Check Inventory', description: 'System checks ingredient stock levels' },
        { number: 2, title: 'Reorder Alert', description: 'System alerts when below reorder point' },
        { number: 3, title: 'Create Purchase Order', description: 'Inventory Custodian creates Order_Tran' },
        { number: 4, title: 'Add Order Line Items', description: 'System creates Order_Line_Item records' },
        { number: 5, title: 'Send to Supplier', description: 'Purchase order sent to supplier' },
        { number: 6, title: 'Receive Delivery', description: 'Supplier delivers items' },
        { number: 7, title: 'Create Delivery Receipt', description: 'System creates Deliv_Tran record' },
        { number: 8, title: 'Update Inventory', description: 'System updates ingredient stock levels' }
      ],
      color: 'bg-[#f59e0b]'
    },
    {
      title: 'Inventory Release Process',
      steps: [
        { number: 1, title: 'Cook Requests Ingredients', description: 'Cook needs ingredients for preparation' },
        { number: 2, title: 'Check Stock Availability', description: 'System verifies ingredient availability' },
        { number: 3, title: 'Create Release Record', description: 'Inventory Custodian creates Rel_Record' },
        { number: 4, title: 'Add Release Line Items', description: 'System creates Ro_Line_Item records' },
        { number: 5, title: 'Authorize Release', description: 'System validates authorization' },
        { number: 6, title: 'Deduct from Inventory', description: 'System automatically deducts stock' },
        { number: 7, title: 'Update Records', description: 'Release record finalized and logged' }
      ],
      color: 'bg-[#84cc16]'
    },
    {
      title: 'POS Order Flow',
      steps: [
        { number: 1, title: 'Cashier Opens POS', description: 'Cashier logs in and opens POS interface' },
        { number: 2, title: 'Select Customer', description: 'Cashier selects or creates customer record' },
        { number: 3, title: 'Add Menu Items', description: 'Cashier adds items to order' },
        { number: 4, title: 'Real-time Validation', description: 'System checks item availability in real-time' },
        { number: 5, title: 'Calculate Subtotal', description: 'System calculates running total' },
        { number: 6, title: 'Apply Discounts', description: 'Optional: Apply discounts or promotions' },
        { number: 7, title: 'Finalize Transaction', description: 'Cashier finalizes and processes payment' },
        { number: 8, title: 'Update Inventory', description: 'System updates menu item quantities' },
        { number: 9, title: 'Print Receipt', description: 'System generates receipt for customer' }
      ],
      color: 'bg-[#f97316]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#fefbf8] via-[#f5f1eb] to-[#e8e3db] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              System Workflows
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Step-by-step workflows that illustrate how different processes operate within 
              the DMP Restaurant Management System, from customer orders to inventory management.
            </p>
          </div>
        </div>
      </section>

      {/* Workflows */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-16">
            {workflows.map((workflow, workflowIndex) => (
              <div key={workflowIndex} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center mb-8">
                  <div className={`${workflow.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mr-4`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{workflow.title}</h2>
                </div>

                {/* Flow Steps */}
                <div className="relative">
                  {/* Connection Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block"></div>
                  
                  <div className="space-y-6">
                    {workflow.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="relative flex items-start">
                        {/* Step Number Circle */}
                        <div className={`${workflow.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 flex-shrink-0`}>
                          {step.number}
                        </div>
                        
                        {/* Step Content */}
                        <div className="ml-6 flex-1 bg-[#f5f1eb] rounded-xl p-6 border border-[#e8e3db]">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Overview */}
      <section className="py-20 bg-[#f5f1eb]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            System Integration Points
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-[#f97316] rounded-lg flex items-center justify-center text-white mr-4">
                  🔄
                </span>
                Real-Time Updates
              </h3>
              <p className="text-gray-600 mb-4">
                All workflows are designed to update the database in real-time, ensuring 
                that inventory levels, sales records, and transaction data are always current.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#f97316] mr-2">•</span>
                  <span>Inventory updates immediately after sales</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#f97316] mr-2">•</span>
                  <span>Stock levels reflect releases instantly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#f97316] mr-2">•</span>
                  <span>Delivery receipts update ingredient stock</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-[#84cc16] rounded-lg flex items-center justify-center text-white mr-4">
                  🔐
                </span>
                Role-Based Security
              </h3>
              <p className="text-gray-600 mb-4">
                Each workflow respects role-based access control, ensuring that only authorized 
                employees can perform specific actions within the system.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#84cc16] mr-2">•</span>
                  <span>Cashiers can process sales transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#84cc16] mr-2">•</span>
                  <span>Cooks can view inventory but not release</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#84cc16] mr-2">•</span>
                  <span>Inventory Custodians manage releases and orders</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-[#f59e0b] rounded-lg flex items-center justify-center text-white mr-4">
                  📊
                </span>
                Data Consistency
              </h3>
              <p className="text-gray-600 mb-4">
                All workflows maintain data integrity through proper transaction handling, 
                ensuring that related records are created and updated atomically.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#f59e0b] mr-2">•</span>
                  <span>Transaction headers and line items created together</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#f59e0b] mr-2">•</span>
                  <span>Inventory updates are transactional</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#f59e0b] mr-2">•</span>
                  <span>Rollback support for failed operations</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-[#f97316] rounded-lg flex items-center justify-center text-white mr-4">
                  ⚡
                </span>
                Automated Processes
              </h3>
              <p className="text-gray-600 mb-4">
                The system automates many routine tasks, reducing manual work and minimizing 
                the potential for human error.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#f97316] mr-2">•</span>
                  <span>Automatic inventory deduction on releases</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#f97316] mr-2">•</span>
                  <span>Reorder point alerts and suggestions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#f97316] mr-2">•</span>
                  <span>Automatic total calculations in POS</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow Diagram */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Complete System Flow
          </h2>

          <div className="bg-[#f5f1eb] rounded-2xl p-8">
            <div className="space-y-8">
              {/* Sales Cycle */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sales Cycle</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-semibold">Customer Order</div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-semibold">POS Transaction</div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-semibold">Inventory Update</div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-semibold">Receipt Generation</div>
                </div>
              </div>

              {/* Inventory Cycle */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Inventory Cycle</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="bg-[#84cc16] text-white px-4 py-2 rounded-lg font-semibold">Low Stock Alert</div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-[#84cc16] text-white px-4 py-2 rounded-lg font-semibold">Purchase Order</div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-[#84cc16] text-white px-4 py-2 rounded-lg font-semibold">Delivery Receipt</div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-[#84cc16] text-white px-4 py-2 rounded-lg font-semibold">Stock Update</div>
                </div>
              </div>

              {/* Release Cycle */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Release Cycle</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="bg-[#f59e0b] text-white px-4 py-2 rounded-lg font-semibold">Cook Request</div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-[#f59e0b] text-white px-4 py-2 rounded-lg font-semibold">Release Authorization</div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-[#f59e0b] text-white px-4 py-2 rounded-lg font-semibold">Stock Deduction</div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-[#f59e0b] text-white px-4 py-2 rounded-lg font-semibold">Record Update</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Explore the Complete System
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Learn more about the features and database architecture that power these workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/features"
              className="px-8 py-3 bg-white text-[#f97316] rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              View Features
            </Link>
            <Link
              href="/database"
              className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              See Database Model
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

