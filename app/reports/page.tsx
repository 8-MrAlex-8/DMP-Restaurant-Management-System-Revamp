'use client';

import { useEffect, useState } from 'react';
import { salesTranDb, menuItemDb } from '@/lib/db';

export default function ReportsPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesData, menuData] = await Promise.all([salesTranDb.getAll(), menuItemDb.getAll()]);
      setSales(salesData);
      setMenuItems(menuData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter((sale: any) => {
    if (sale.status !== 'completed') return false;
    const saleDate = sale.transaction_date?.split('T')[0] || sale.transaction_date;
    return saleDate >= dateRange.start && saleDate <= dateRange.end;
  });

  const totalSales = filteredSales.reduce((sum: number, sale: any) => sum + (sale.total_amount || 0), 0);
  const totalTransactions = filteredSales.length;

  // Calculate item popularity
  const itemPopularity: Record<string, { name: string; quantity: number; revenue: number }> = {};
  filteredSales.forEach((sale: any) => {
    if (sale.sales_line_item) {
      sale.sales_line_item.forEach((item: any) => {
        const menuItemId = item.menu_item_id;
        const menuItem = menuItems.find((m: any) => m.menu_item_id === menuItemId);
        if (menuItem) {
          if (!itemPopularity[menuItemId]) {
            itemPopularity[menuItemId] = {
              name: menuItem.name,
              quantity: 0,
              revenue: 0,
            };
          }
          itemPopularity[menuItemId].quantity += item.quantity || 0;
          itemPopularity[menuItemId].revenue += item.subtotal || 0;
        }
      });
    }
  });

  const popularItems = Object.entries(itemPopularity)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  // Daily sales breakdown
  const dailySales: Record<string, number> = {};
  filteredSales.forEach((sale: any) => {
    const date = sale.transaction_date?.split('T')[0] || sale.transaction_date;
    if (date) {
      dailySales[date] = (dailySales[date] || 0) + (sale.total_amount || 0);
    }
  });

  const dailySalesArray = Object.entries(dailySales)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (loading) {
    return <div className="min-h-screen bg-[#fefbf8] flex items-center justify-center">Loading reports...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Reports & Analytics</h1>

        {/* Date Range Filter */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Date Range</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Total Sales</div>
            <div className="text-3xl font-bold text-[#f97316]">₱{totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Total Transactions</div>
            <div className="text-3xl font-bold text-gray-900">{totalTransactions}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Average Transaction</div>
            <div className="text-3xl font-bold text-gray-900">
              ₱{totalTransactions > 0 ? (totalSales / totalTransactions).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </div>
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Most Popular Items</h2>
          {popularItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No sales data in selected period</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f5f1eb]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity Sold</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {popularItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="w-8 h-8 bg-[#f97316] text-white rounded-full flex items-center justify-center inline-block text-center">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">₱{item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Daily Sales */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Sales Breakdown</h2>
          {dailySalesArray.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No sales data in selected period</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f5f1eb]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sales Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Transactions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dailySalesArray.map((day) => {
                    const dayTransactions = filteredSales.filter(
                      (sale: any) => (sale.transaction_date?.split('T')[0] || sale.transaction_date) === day.date
                    );
                    return (
                      <tr key={day.date} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{new Date(day.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">₱{day.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{dayTransactions.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
          {filteredSales.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No transactions in selected period</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f5f1eb]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSales.slice(0, 20).map((sale: any) => (
                    <tr key={sale.sales_tran_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(sale.transaction_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{sale.customers?.name || 'Walk-in'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{sale.employees?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">₱{sale.total_amount?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



