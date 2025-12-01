'use client';

import { useEffect, useState } from 'react';
import { relRecordDb, roLineItemDb, employeeDb, ingredientDb } from '@/lib/db';
import type { RelRecord, RoLineItem, Employee, Ingredient } from '@/lib/types';

export default function ReleasesPage() {
  const [releases, setReleases] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ employee_id: '', release_date: new Date().toISOString().split('T')[0], purpose: '' });
  const [releaseItems, setReleaseItems] = useState<Array<RoLineItem & { ingredient: Ingredient }>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rels, emps, ings] = await Promise.all([relRecordDb.getAll(), employeeDb.getAll(), ingredientDb.getAll()]);
      setReleases(rels);
      setEmployees(emps);
      setIngredients(ings);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (releaseItems.length === 0) {
      alert('Please add items to release');
      return;
    }
    try {
      const release = await relRecordDb.create({
        employee_id: formData.employee_id,
        release_date: formData.release_date,
        purpose: formData.purpose || null,
      });

      for (const item of releaseItems) {
        await roLineItemDb.create({
          rel_record_id: release.rel_record_id!,
          ingredient_id: item.ingredient_id,
          quantity_released: item.quantity_released,
        });

        // Deduct from inventory
        const ingredient = ingredients.find((i) => i.ingredient_id === item.ingredient_id);
        if (ingredient) {
          if (ingredient.current_stock < item.quantity_released) {
            alert(`Not enough stock for ${ingredient.name}`);
            continue;
          }
          await ingredientDb.update(item.ingredient_id, {
            current_stock: ingredient.current_stock - item.quantity_released,
          });
        }
      }

      alert('Release recorded successfully');
      setShowForm(false);
      setFormData({ employee_id: '', release_date: new Date().toISOString().split('T')[0], purpose: '' });
      setReleaseItems([]);
      loadData();
    } catch (error) {
      console.error('Error creating release:', error);
      alert('Error creating release');
    }
  };

  const addReleaseItem = () => {
    if (ingredients.length === 0) {
      alert('No ingredients available');
      return;
    }
    const ingredient = ingredients[0];
    setReleaseItems([
      ...releaseItems,
      {
        rel_record_id: '',
        ingredient_id: ingredient.ingredient_id!,
        quantity_released: 0,
        ingredient,
      },
    ]);
  };

  const removeReleaseItem = (index: number) => {
    setReleaseItems(releaseItems.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fefbf8] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Ingredient Releases</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setFormData({ employee_id: '', release_date: new Date().toISOString().split('T')[0], purpose: '' });
              setReleaseItems([]);
            }}
            className="px-6 py-3 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
          >
            + New Release
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Release Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                  <select
                    required
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                  >
                    <option value="">Select employee</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.employee_id}>
                        {employee.name} ({employee.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Release Date</label>
                  <input
                    type="date"
                    required
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose (Optional)</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Release Items</label>
                  <button
                    type="button"
                    onClick={addReleaseItem}
                    className="px-4 py-1 text-sm bg-[#84cc16] text-white rounded hover:bg-[#65a30d] transition-colors"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {releaseItems.map((item, index) => (
                    <div key={index} className="flex gap-2 items-end border border-gray-200 rounded-lg p-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Ingredient</label>
                        <select
                          required
                          value={item.ingredient_id}
                          onChange={(e) => {
                            const ingredient = ingredients.find((i) => i.ingredient_id === e.target.value);
                            const updated = [...releaseItems];
                            updated[index] = {
                              ...item,
                              ingredient_id: e.target.value,
                              ingredient: ingredient!,
                            };
                            setReleaseItems(updated);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                        >
                          <option value="">Select ingredient</option>
                          {ingredients.map((ing) => (
                            <option key={ing.ingredient_id} value={ing.ingredient_id}>
                              {ing.name} (Stock: {ing.current_stock} {ing.unit})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          required
                          min="0"
                          max={item.ingredient?.current_stock || 0}
                          value={item.quantity_released}
                          onChange={(e) => {
                            const updated = [...releaseItems];
                            updated[index].quantity_released = parseFloat(e.target.value) || 0;
                            setReleaseItems(updated);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeReleaseItem(index)}
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
                  Create Release
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setReleaseItems([]);
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Release Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Purpose</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {releases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No releases found</td>
                </tr>
              ) : (
                releases.map((release: any) => (
                  <tr key={release.rel_record_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(release.release_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{release.employees?.name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{release.purpose || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {release.ro_line_item?.length || 0} item(s)
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



