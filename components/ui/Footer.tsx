export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-light mb-4">barelab</h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Transparent, data-driven cosmetics reviews based on real user feedback.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 text-neutral-900">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="text-sm text-neutral-600 hover:text-neutral-900">
                  All Products
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm text-neutral-600 hover:text-neutral-900">
                  About
                </a>
              </li>
              <li>
                <a href="/admin" className="text-sm text-neutral-600 hover:text-neutral-900">
                  Admin
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 text-neutral-900">Disclaimer</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              All product insights are based on aggregated user feedback and may vary depending on individual skin type, routine, and environment. This information is not a substitute for professional advice.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 text-center">
            © {new Date().getFullYear()} barelab. No sponsored content. No paid reviews.
          </p>
        </div>
      </div>
    </footer>
  )
}
