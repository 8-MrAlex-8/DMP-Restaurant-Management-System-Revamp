'use client';

import { useEffect, useState } from 'react';
import { ingredientDb } from '@/lib/db';
import type { Ingredient } from '@/lib/types';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    current_stock: 0,
    reorder_point: 0,
    expiry_date: '',
    auto_order_qty: 0,
    unit: '',
  });

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const data = await ingredientDb.getAll();
      setIngredients(data);
    } catch (error) {
      console.error('Error loading ingredients:', error);
      alert('Error loading ingredients');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        expiry_date: formData.expiry_date || null,
      };
      if (editing) {
        await ingredientDb.update(editing.ingredient_id!, payload);
      } else {
        await ingredientDb.create(payload);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', current_stock: 0, reorder_point: 0, expiry_date: '', auto_order_qty: 0, unit: '' });
      loadIngredients();
    } catch (error) {
      console.error('Error saving ingredient:', error);
      alert('Error saving ingredient');
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditing(ingredient);
    setFormData({
      name: ingredient.name,
      current_stock: ingredient.current_stock,
      reorder_point: ingredient.reorder_point,
      expiry_date: ingredient.expiry_date ? ingredient.expiry_date.split('T')[0] : '',
      auto_order_qty: ingredient.auto_order_qty,
      unit: ingredient.unit,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;
    try {
      await ingredientDb.delete(id);
      loadIngredients();
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      alert('Error deleting ingredient');
    }
  };

  const isLowStock = (ingredient: Ingredient) => ingredient.current_stock <= ingredient.reorder_point;

  if (loading) {
    return <div className="min-h-screen bg-[#fefbf8] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Inventory - Ingredients</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setFormData({ name: '', current_stock: 0, reorder_point: 0, expiry_date: '', auto_order_qty: 0, unit: '' });
            }}
            className="px-6 py-3 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
          >
            + Add Ingredient
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{editing ? 'Edit' : 'Add'} Ingredient</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.current_stock}
                    onChange={(e) => setFormData({ ...formData, current_stock: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g., kg, liters, pieces"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Point</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.reorder_point}
                    onChange={(e) => setFormData({ ...formData, reorder_point: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto Order Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.auto_order_qty}
                    onChange={(e) => setFormData({ ...formData, auto_order_qty: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (optional)</label>
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
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
                    setFormData({ name: '', current_stock: 0, reorder_point: 0, expiry_date: '', auto_order_qty: 0, unit: '' });
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reorder Point</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Auto Order Qty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expiry Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ingredients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No ingredients found. Add your first ingredient!
                  </td>
                </tr>
              ) : (
                ingredients.map((ingredient) => (
                  <tr
                    key={ingredient.ingredient_id}
                    className={`hover:bg-gray-50 ${isLowStock(ingredient) ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{ingredient.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={isLowStock(ingredient) ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                        {ingredient.current_stock} {ingredient.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ingredient.reorder_point} {ingredient.unit}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ingredient.auto_order_qty} {ingredient.unit}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {ingredient.expiry_date ? new Date(ingredient.expiry_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(ingredient)}
                          className="px-3 py-1 text-sm bg-[#84cc16] text-white rounded hover:bg-[#65a30d] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ingredient.ingredient_id!)}
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



