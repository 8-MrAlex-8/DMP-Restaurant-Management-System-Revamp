'use client';

import { useEffect, useState } from 'react';
import { customerDb } from '@/lib/db';
import type { Customer } from '@/lib/types';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ name: '', contact_info: '' });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customerDb.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      alert('Error loading customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await customerDb.update(editing.customer_id!, formData);
      } else {
        await customerDb.create(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', contact_info: '' });
      loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error saving customer');
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditing(customer);
    setFormData({ name: customer.name, contact_info: customer.contact_info });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await customerDb.delete(id);
      loadCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fefbf8] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Customers</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setFormData({ name: '', contact_info: '' });
            }}
            className="px-6 py-3 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
          >
            + Add Customer
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{editing ? 'Edit' : 'Add'} Customer</h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
                <input
                  type="text"
                  required
                  value={formData.contact_info}
                  onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
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
                    setFormData({ name: '', contact_info: '' });
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact Info</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No customers found. Add your first customer!
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.customer_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.contact_info}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="px-3 py-1 text-sm bg-[#84cc16] text-white rounded hover:bg-[#65a30d] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer.customer_id!)}
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



