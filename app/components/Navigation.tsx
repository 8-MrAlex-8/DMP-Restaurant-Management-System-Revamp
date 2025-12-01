'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/customers', label: 'Customers' },
    { href: '/employees', label: 'Employees' },
    { href: '/suppliers', label: 'Suppliers' },
    { href: '/menu', label: 'Menu Items' },
    { href: '/ingredients', label: 'Inventory' },
    { href: '/pos', label: 'POS Sales' },
    { href: '/purchases', label: 'Purchases' },
    { href: '/releases', label: 'Releases' },
    { href: '/reports', label: 'Reports' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-[#f97316]">
            DMP Restaurant
          </Link>
          <div className="flex gap-3 sm:gap-6 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  pathname === item.href
                    ? 'text-[#f97316] border-b-2 border-[#f97316] pb-1'
                    : 'text-gray-600 hover:text-[#f97316]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
