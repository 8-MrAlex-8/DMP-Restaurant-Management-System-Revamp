'use client';

import { useEffect, useState } from 'react';
import { orderTranDb, orderLineItemDb, delivTranDb, delvLineItemDb, supplierDb, ingredientDb } from '@/lib/db';
import type { OrderTran, OrderLineItem, DelivTran, DelvLineItem, Supplier, Ingredient } from '@/lib/types';

export default function PurchasesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderTran | null>(null);
  const [orderFormData, setOrderFormData] = useState({ supplier_id: '', order_date: new Date().toISOString().split('T')[0], expected_delivery: '' });
  const [orderItems, setOrderItems] = useState<Array<OrderLineItem & { ingredient: Ingredient }>>([]);
  const [deliveryItems, setDeliveryItems] = useState<Array<DelvLineItem & { ingredient: Ingredient }>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ords, delivs, supps, ings] = await Promise.all([
        orderTranDb.getAll(),
        delivTranDb.getAll(),
        supplierDb.getAll(),
        ingredientDb.getAll(),
      ]);
      setOrders(ords);
      setDeliveries(delivs);
      setSuppliers(supps);
      setIngredients(ings);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert('Please add items to the order');
      return;
    }
    try {
      const order = await orderTranDb.create({
        ...orderFormData,
        expected_delivery: orderFormData.expected_delivery || null,
        status: 'pending',
      });

      for (const item of orderItems) {
        await orderLineItemDb.create({
          order_tran_id: order.order_tran_id!,
          ingredient_id: item.ingredient_id,
          quantity_ordered: item.quantity_ordered,
          unit_cost: item.unit_cost,
        });
      }

      alert('Purchase order created successfully');
      setShowOrderForm(false);
      setOrderFormData({ supplier_id: '', order_date: new Date().toISOString().split('T')[0], expected_delivery: '' });
      setOrderItems([]);
      loadData();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
    }
  };

  const addOrderItem = () => {
    if (ingredients.length === 0) {
      alert('No ingredients available');
      return;
    }
    const ingredient = ingredients[0];
    setOrderItems([
      ...orderItems,
      {
        order_tran_id: '',
        ingredient_id: ingredient.ingredient_id!,
        quantity_ordered: ingredient.auto_order_qty,
        unit_cost: 0,
        ingredient,
      },
    ]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleCreateDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) {
      alert('Please select an order');
      return;
    }
    if (deliveryItems.length === 0) {
      alert('Please add items to the delivery');
      return;
    }
    try {
      const delivery = await delivTranDb.create({
        order_tran_id: selectedOrder.order_tran_id!,
        delivery_date: new Date().toISOString().split('T')[0],
        status: 'received',
      });

      for (const item of deliveryItems) {
        await delvLineItemDb.create({
          deliv_tran_id: delivery.deliv_tran_id!,
          ingredient_id: item.ingredient_id,
          quantity_received: item.quantity_received,
          actual_cost: item.actual_cost,
        });

        // Update ingredient stock
        const ingredient = ingredients.find((i) => i.ingredient_id === item.ingredient_id);
        if (ingredient) {
          await ingredientDb.update(item.ingredient_id, {
            current_stock: ingredient.current_stock + item.quantity_received,
          });
        }
      }

      // Update order status
      await orderTranDb.update(selectedOrder.order_tran_id!, { status: 'delivered' });

      alert('Delivery recorded successfully');
      setShowDeliveryForm(false);
      setSelectedOrder(null);
      setDeliveryItems([]);
      loadData();
    } catch (error) {
      console.error('Error creating delivery:', error);
      alert('Error creating delivery');
    }
  };

  const loadOrderItems = async (orderId: string) => {
    try {
      const items = await orderLineItemDb.getByOrder(orderId);
      setDeliveryItems(
        items.map((item: any) => ({
          deliv_tran_id: '',
          ingredient_id: item.ingredient_id,
          quantity_received: item.quantity_ordered,
          actual_cost: item.unit_cost,
          ingredient: item.ingredients,
        }))
      );
    } catch (error) {
      console.error('Error loading order items:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fefbf8] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Purchases & Deliveries</h1>
          <button
            onClick={() => {
              setShowOrderForm(true);
              setOrderFormData({ supplier_id: '', order_date: new Date().toISOString().split('T')[0], expected_delivery: '' });
              setOrderItems([]);
            }}
            className="px-6 py-3 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
          >
            + New Purchase Order
          </button>
        </div>

        {/* Purchase Orders */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchase Orders</h2>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f5f1eb]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Supplier</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expected Delivery</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No purchase orders found</td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr key={order.order_tran_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(order.order_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.suppliers?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.expected_delivery ? new Date(order.expected_delivery).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'ordered'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {order.status !== 'delivered' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              loadOrderItems(order.order_tran_id);
                              setShowDeliveryForm(true);
                            }}
                            className="px-3 py-1 text-sm bg-[#84cc16] text-white rounded hover:bg-[#65a30d] transition-colors"
                          >
                            Record Delivery
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deliveries */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deliveries</h2>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f5f1eb]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Delivery Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Supplier</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deliveries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No deliveries found</td>
                  </tr>
                ) : (
                  deliveries.map((delivery: any) => (
                    <tr key={delivery.deliv_tran_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(delivery.delivery_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {delivery.order_tran?.order_date ? new Date(delivery.order_tran.order_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {delivery.order_tran?.suppliers?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {delivery.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Form Modal */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Purchase Order</h2>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                  <select
                    required
                    value={orderFormData.supplier_id}
                    onChange={(e) => setOrderFormData({ ...orderFormData, supplier_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.supplier_id} value={supplier.supplier_id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Date</label>
                    <input
                      type="date"
                      required
                      value={orderFormData.order_date}
                      onChange={(e) => setOrderFormData({ ...orderFormData, order_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery</label>
                    <input
                      type="date"
                      value={orderFormData.expected_delivery}
                      onChange={(e) => setOrderFormData({ ...orderFormData, expected_delivery: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Order Items</label>
                    <button
                      type="button"
                      onClick={addOrderItem}
                      className="px-4 py-1 text-sm bg-[#84cc16] text-white rounded hover:bg-[#65a30d] transition-colors"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-end border border-gray-200 rounded-lg p-3">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Ingredient</label>
                          <select
                            required
                            value={item.ingredient_id}
                            onChange={(e) => {
                              const ingredient = ingredients.find((i) => i.ingredient_id === e.target.value);
                              const updated = [...orderItems];
                              updated[index] = {
                                ...item,
                                ingredient_id: e.target.value,
                                quantity_ordered: ingredient?.auto_order_qty || 0,
                                ingredient: ingredient!,
                              };
                              setOrderItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                          >
                            <option value="">Select ingredient</option>
                            {ingredients.map((ing) => (
                              <option key={ing.ingredient_id} value={ing.ingredient_id}>
                                {ing.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-24">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={item.quantity_ordered}
                            onChange={(e) => {
                              const updated = [...orderItems];
                              updated[index].quantity_ordered = parseFloat(e.target.value) || 0;
                              setOrderItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Unit Cost</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            min="0"
                            value={item.unit_cost}
                            onChange={(e) => {
                              const updated = [...orderItems];
                              updated[index].unit_cost = parseFloat(e.target.value) || 0;
                              setOrderItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOrderItem(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
                  >
                    Create Order
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOrderForm(false);
                      setOrderItems([]);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delivery Form Modal */}
        {showDeliveryForm && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Record Delivery</h2>
              <form onSubmit={handleCreateDelivery} className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600">Order Date: {new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Supplier: {(selectedOrder as any).suppliers?.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Items</label>
                  <div className="space-y-2">
                    {deliveryItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-end border border-gray-200 rounded-lg p-3">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{item.ingredient.name}</div>
                          <div className="text-xs text-gray-600">Ordered: {item.quantity_received}</div>
                        </div>
                        <div className="w-24">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Received</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={item.quantity_received}
                            onChange={(e) => {
                              const updated = [...deliveryItems];
                              updated[index].quantity_received = parseFloat(e.target.value) || 0;
                              setDeliveryItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Actual Cost</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            min="0"
                            value={item.actual_cost}
                            onChange={(e) => {
                              const updated = [...deliveryItems];
                              updated[index].actual_cost = parseFloat(e.target.value) || 0;
                              setDeliveryItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
                  >
                    Record Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeliveryForm(false);
                      setSelectedOrder(null);
                      setDeliveryItems([]);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



