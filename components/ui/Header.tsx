'use client'

import Link from 'next/link'
import { useState } from 'react'

const categories = {
  makeup: {
    label: 'Make Up',
    subcategories: [
      { label: 'Face', items: ['Foundation', 'Concealer', 'Blush', 'Powder', 'Bronzer', 'Highlighter'] },
      { label: 'Eyes', items: ['Eyeshadow', 'Eyeliner', 'Mascara', 'Brow'] },
      { label: 'Lips', items: ['Lipstick', 'Lip Gloss', 'Lip Liner'] },
    ]
  },
  skincare: {
    label: 'Skincare',
    subcategories: [
      { label: 'Cleansers', items: ['Face Wash', 'Micellar Water', 'Oil Cleanser', 'Toner'] },
      { label: 'Treatment', items: ['Serum', 'Essence', 'Ampoule', 'Face Oil'] },
      { label: 'Moisturizers', items: ['Day Cream', 'Night Cream', 'Eye Cream', 'Face Mask'] },
      { label: 'Sun Care', items: ['Sunscreen', 'SPF Moisturizer'] },
    ]
  },
  hair: {
    label: 'Hair',
    subcategories: [
      { label: 'Hair Care', items: ['Shampoo', 'Conditioner', 'Hair Mask', 'Leave-in'] },
      { label: 'Styling', items: ['Hair Spray', 'Gel', 'Mousse', 'Serum'] },
    ]
  },
  body: {
    label: 'Body',
    subcategories: [
      { label: 'Body Care', items: ['Body Wash', 'Body Lotion', 'Body Scrub', 'Hand Cream'] },
    ]
  },
}

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-light tracking-tight">
            barelab
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Category Dropdowns */}
            {Object.entries(categories).map(([key, category]) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setActiveDropdown(key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors py-2">
                  {category.label}
                </button>

                {/* Dropdown */}
                {activeDropdown === key && (
                  <div className="absolute top-full left-0 mt-2 w-[600px] bg-white border border-neutral-200 shadow-lg rounded-lg p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {category.subcategories.map((subcat) => (
                        <div key={subcat.label}>
                          <div className="text-xs uppercase tracking-wider text-neutral-500 mb-3 font-medium">
                            {subcat.label}
                          </div>
                          <ul className="space-y-2">
                            {subcat.items.map((item) => (
                              <li key={item}>
                                <Link
                                  href={`/category/${item.toLowerCase().replace(' ', '-')}`}
                                  className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors block py-1"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Brands */}
            <Link
              href="/brands"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Brands
            </Link>

            {/* About */}
            <Link
              href="/about"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
