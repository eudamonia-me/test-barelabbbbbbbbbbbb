'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface AdminHeaderProps {
  user: any
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="text-xl font-light">
            barelab <span className="text-sm text-neutral-500">admin</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            target="_blank"
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            View Site →
          </Link>
          <span className="text-sm text-neutral-600">{user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
