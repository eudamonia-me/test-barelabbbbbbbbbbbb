'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/comments', label: 'Comments', icon: '💬' },
  { href: '/admin/tags', label: 'Tags', icon: '🏷️' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-colors',
                isActive
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
