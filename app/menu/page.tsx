'use client';

import { useEffect, useState } from 'react';
import { menuItemDb } from '@/lib/db';
import type { MenuItem } from '@/lib/types';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({ name: '', price: 0, unit_measure: '', quantity_available: 0 });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const data = await menuItemDb.getAll();
      setMenuItems(data);
    } catch (error) {
      console.error('Error loading menu items:', error);
      alert('Error loading menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await menuItemDb.update(editing.menu_item_id!, formData);
      } else {
        await menuItemDb.create(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', price: 0, unit_measure: '', quantity_available: 0 });
      loadMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Error saving menu item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditing(item);
    setFormData({
      name: item.name,
      price: item.price,
      unit_measure: item.unit_measure,
      quantity_available: item.quantity_available,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await menuItemDb.delete(id);
      loadMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Error deleting menu item');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fefbf8] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Menu Items</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setFormData({ name: '', price: 0, unit_measure: '', quantity_available: 0 });
            }}
            className="px-6 py-3 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
          >
            + Add Menu Item
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{editing ? 'Edit' : 'Add'} Menu Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Measure</label>
                  <input
                    type="text"
                    required
                    value={formData.unit_measure}
                    onChange={(e) => setFormData({ ...formData, unit_measure: e.target.value })}
                    placeholder="e.g., per piece, per serving"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Available</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.quantity_available}
                  onChange={(e) => setFormData({ ...formData, quantity_available: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
                >
                  {editing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                    setFormData({ name: '', price: 0, unit_measure: '', quantity_available: 0 });
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f5f1eb]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Unit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Available</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {menuItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No menu items found. Add your first menu item!
                  </td>
                </tr>
              ) : (
                menuItems.map((item) => (
                  <tr key={item.menu_item_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₱{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.unit_measure}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={item.quantity_available > 0 ? 'text-gray-900' : 'text-red-600 font-semibold'}>
                        {item.quantity_available}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 text-sm bg-[#84cc16] text-white rounded hover:bg-[#65a30d] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.menu_item_id!)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



