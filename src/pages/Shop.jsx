import { useEffect, useMemo, useState } from 'react'
import { FiGrid, FiList, FiSearch } from 'react-icons/fi'
import PageWrap from '../components/PageWrap'
import ProductCard from '../components/ProductCard'
import { categories } from '../data/products'
import { useProducts } from '../hooks/useProducts'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best', label: 'Best Sellers' },
]

export default function Shop() {
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [search, setSearch] = useState('')
  const [maxPrice, setMaxPrice] = useState(2000)
  const [view, setView] = useState('grid')
  const { products, usingFallback } = useProducts()

  const priceCeiling = useMemo(
    () => Math.max(500, ...products.map((p) => p.price || 0)),
    [products]
  )

  useEffect(() => {
    setMaxPrice(priceCeiling)
  }, [priceCeiling])

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        p.price <= maxPrice &&
        p.name.toLowerCase().includes(search.toLowerCase())
    )
    switch (sort) {
      case 'newest':
        list = [...list].sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1))
        break
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'best':
        list = [...list].sort((a, b) => (b.bestSeller === a.bestSeller ? 0 : b.bestSeller ? 1 : -1))
        break
      default:
        break
    }
    return list
  }, [category, sort, search, maxPrice, products])

  return (
    <PageWrap className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-3">The Collection</p>
        <h1 className="font-display text-4xl md:text-5xl text-ivory">Shop All Fragrances</h1>
        {usingFallback && (
          <p className="text-[11px] text-hover-glow mt-3">Showing sample data — backend API not reachable.</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="lg:w-64 shrink-0 space-y-10">
          <div className="relative">
            <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-grey" size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fragrances"
              className="w-full bg-transparent border-b border-gold/20 focus:border-gold pl-6 pb-2 text-sm text-ivory placeholder:text-grey/60 outline-none transition-colors"
            />
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Category</h4>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setCategory(c)}
                    className={`text-sm transition-colors ${category === c ? 'text-gold' : 'text-grey hover:text-ivory'}`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Max Price: ${maxPrice}</h4>
            <input
              type="range"
              min="0"
              max={priceCeiling}
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#D4AF37]"
            />
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <p className="text-xs text-grey">{filtered.length} fragrances</p>
            <div className="flex items-center gap-6">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-charcoal border border-gold/20 text-xs text-ivory px-3 py-2 outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <button onClick={() => setView('grid')} aria-label="Grid view" className={view === 'grid' ? 'text-gold' : 'text-grey'}>
                  <FiGrid size={16} />
                </button>
                <button onClick={() => setView('list')} aria-label="List view" className={view === 'list' ? 'text-gold' : 'text-grey'}>
                  <FiList size={16} />
                </button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-grey text-sm py-20 text-center">No fragrances match those filters. Try widening your search.</p>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8' : 'flex flex-col gap-6'}>
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrap>
  )
}
