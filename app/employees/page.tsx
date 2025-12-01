'use client';

import { useEffect, useState } from 'react';
import { employeeDb } from '@/lib/db';
import type { Employee, Role } from '@/lib/types';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({ name: '', role: 'Cashier' as Role, email: '', password: '' });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await employeeDb.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      alert('Error loading employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
      };
      if (formData.password) {
        payload.password_hash = formData.password; // In production, hash this properly
      }
      if (editing) {
        await employeeDb.update(editing.employee_id!, payload);
      } else {
        if (!formData.password) {
          alert('Password is required for new employees');
          return;
        }
        await employeeDb.create(payload);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', role: 'Cashier', email: '', password: '' });
      loadEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditing(employee);
    setFormData({ name: employee.name, role: employee.role, email: employee.email, password: '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await employeeDb.delete(id);
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee');
    }
  };

  const roleColors: Record<Role, string> = {
    Cook: 'bg-blue-100 text-blue-800',
    Cashier: 'bg-green-100 text-green-800',
    'Inventory Custodian': 'bg-purple-100 text-purple-800',
    Admin: 'bg-orange-100 text-orange-800',
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fefbf8] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Employees</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setFormData({ name: '', role: 'Cashier', email: '', password: '' });
            }}
            className="px-6 py-3 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
          >
            + Add Employee
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{editing ? 'Edit' : 'Add'} Employee</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                >
                  <option value="Cashier">Cashier</option>
                  <option value="Cook">Cook</option>
                  <option value="Inventory Custodian">Inventory Custodian</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password {editing && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  required={!editing}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    setFormData({ name: '', role: 'Cashier', email: '', password: '' });
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No employees found. Add your first employee!
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.employee_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[employee.role]}`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {employee.created_at ? new Date(employee.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="px-3 py-1 text-sm bg-[#84cc16] text-white rounded hover:bg-[#65a30d] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee.employee_id!)}
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



