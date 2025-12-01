'use client';

import { useEffect, useState } from 'react';
import { salesTranDb, salesLineItemDb, menuItemDb, customerDb, employeeDb } from '@/lib/db';
import type { MenuItem, Customer, Employee, SalesLineItem } from '@/lib/types';

export default function POSPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [cart, setCart] = useState<Array<SalesLineItem & { menu_item: MenuItem }>>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [menu, custs, emps] = await Promise.all([menuItemDb.getAll(), customerDb.getAll(), employeeDb.getAll()]);
      setMenuItems(menu);
      setCustomers(custs);
      setEmployees(emps);
      if (emps.length > 0) setSelectedEmployee(emps[0]);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (menuItem: MenuItem) => {
    if (menuItem.quantity_available <= 0) {
      alert('Item is out of stock');
      return;
    }

    const existingItem = cart.find((item) => item.menu_item_id === menuItem.menu_item_id);
    if (existingItem) {
      if (existingItem.quantity >= menuItem.quantity_available) {
        alert('Not enough stock available');
        return;
      }
      const updatedCart = cart.map((item) =>
        item.menu_item_id === menuItem.menu_item_id
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.unit_price,
            }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          menu_item_id: menuItem.menu_item_id!,
          sales_tran_id: '',
          quantity: 1,
          unit_price: menuItem.price,
          subtotal: menuItem.price,
          menu_item: menuItem,
        },
      ]);
    }
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(cart.filter((item) => item.menu_item_id !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    const item = cart.find((i) => i.menu_item_id === menuItemId);
    if (!item) return;
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    if (quantity > item.menu_item.quantity_available) {
      alert('Not enough stock available');
      return;
    }
    const updatedCart = cart.map((i) =>
      i.menu_item_id === menuItemId ? { ...i, quantity, subtotal: quantity * i.unit_price } : i
    );
    setCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    if (!selectedEmployee) {
      alert('Please select an employee');
      return;
    }

    setProcessing(true);
    try {
      // Create sales transaction
      const transaction = await salesTranDb.create({
        customer_id: selectedCustomer?.customer_id || null,
        employee_id: selectedEmployee.employee_id!,
        transaction_date: new Date().toISOString(),
        total_amount: total,
        status: 'completed',
      });

      // Create line items
      for (const item of cart) {
        await salesLineItemDb.create({
          sales_tran_id: transaction.sales_tran_id!,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        });

        // Update menu item quantity
        const menuItem = menuItems.find((m) => m.menu_item_id === item.menu_item_id);
        if (menuItem) {
          await menuItemDb.update(item.menu_item_id, {
            quantity_available: menuItem.quantity_available - item.quantity,
          });
        }
      }

      alert(`Transaction completed! Total: ₱${total.toFixed(2)}`);
      setCart([]);
      setSelectedCustomer(null);
      loadData(); // Reload to update stock
    } catch (error) {
      console.error('Error processing transaction:', error);
      alert('Error processing transaction');
    } finally {
      setProcessing(false);
    }
  };

  const handleVoid = () => {
    if (confirm('Are you sure you want to clear the cart?')) {
      setCart([]);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fefbf8] flex items-center justify-center">Loading POS...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">POS - Point of Sale</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Menu Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Customer & Employee</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer (Optional)</label>
                  <select
                    value={selectedCustomer?.customer_id || ''}
                    onChange={(e) => {
                      const customer = customers.find((c) => c.customer_id === e.target.value);
                      setSelectedCustomer(customer || null);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                  >
                    <option value="">Walk-in Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.customer_id} value={customer.customer_id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
                  <select
                    value={selectedEmployee?.employee_id || ''}
                    onChange={(e) => {
                      const employee = employees.find((e) => e.employee_id === e.target.value);
                      setSelectedEmployee(employee || null);
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                  >
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.employee_id}>
                        {employee.name} ({employee.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu Items</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.menu_item_id}
                    onClick={() => addToCart(item)}
                    disabled={item.quantity_available <= 0}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      item.quantity_available > 0
                        ? 'border-gray-200 hover:border-[#f97316] hover:shadow-md bg-white'
                        : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{item.name}</div>
                    <div className="text-sm text-gray-600 mb-2">₱{item.price.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      Stock: {item.quantity_available} {item.unit_measure}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cart</h2>

              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Cart is empty</div>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.menu_item_id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-gray-900">{item.menu_item.name}</div>
                            <div className="text-xs text-gray-600">₱{item.unit_price.toFixed(2)} each</div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.menu_item_id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            ×
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                            >
                              −
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>
                          <div className="font-semibold text-gray-900">₱{item.subtotal.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-[#f97316]">₱{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      disabled={processing || cart.length === 0}
                      className="w-full px-6 py-3 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Processing...' : 'Checkout'}
                    </button>
                    <button
                      onClick={handleVoid}
                      disabled={cart.length === 0}
                      className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



