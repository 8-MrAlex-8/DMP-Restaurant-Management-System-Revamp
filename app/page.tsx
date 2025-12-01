"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { customerDb, salesTranDb, ingredientDb, menuItemDb } from "@/lib/db";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalSales: 0,
    lowStockItems: 0,
    totalMenuItems: 0,
    todaySales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [customers, sales, ingredients, menuItems] = await Promise.all([
        customerDb.getAll(),
        salesTranDb.getAll(),
        ingredientDb.getAll(),
        menuItemDb.getAll(),
      ]);

      const today = new Date().toISOString().split("T")[0];
      const todaySales = sales
        .filter(
          (s: any) =>
            s.transaction_date?.startsWith(today) && s.status === "completed"
        )
        .reduce((sum: number, s: any) => sum + (s.total_amount || 0), 0);

      const lowStock = ingredients.filter(
        (ing: any) => ing.current_stock <= ing.reorder_point
      );

      setStats({
        totalCustomers: customers.length,
        totalSales: sales.filter((s: any) => s.status === "completed").length,
        lowStockItems: lowStock.length,
        totalMenuItems: menuItems.length,
        todaySales,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefbf8] flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefbf8]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalCustomers}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#f97316]/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#f97316]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Sales</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₱{stats.todaySales.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#84cc16]/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#84cc16]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalSales}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#f59e0b]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.lowStockItems}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/pos"
            className="bg-linear-to-br from-[#f97316] to-[#ea580c] rounded-xl p-8 text-white hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-2">POS Sales</h2>
            <p className="opacity-90">Create new sales transaction</p>
          </Link>

          <Link
            href="/ingredients"
            className="bg-linear-to-br from-[#84cc16] to-[#65a30d] rounded-xl p-8 text-white hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-2">Inventory</h2>
            <p className="opacity-90">Manage ingredients and stock</p>
          </Link>

          <Link
            href="/reports"
            className="bg-linear-to-br from-[#f59e0b] to-[#d97706] rounded-xl p-8 text-white hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-2">Reports</h2>
            <p className="opacity-90">View sales and analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
