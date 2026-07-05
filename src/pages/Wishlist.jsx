import { Link } from 'react-router-dom'
import PageWrap from '../components/PageWrap'
import ProductCard from '../components/ProductCard'
import useStore from '../store/useStore'

export default function Wishlist() {
  const wishlist = useStore((s) => s.wishlist)

  if (wishlist.length === 0) {
    return (
      <PageWrap className="pt-40 pb-32 text-center max-w-xl mx-auto px-6">
        <h1 className="font-display text-3xl text-ivory mb-4">Your wishlist is empty</h1>
        <p className="text-grey text-sm mb-8">Save fragrances you're considering for later.</p>
        <Link to="/shop" className="border border-gold text-gold px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-noir transition-colors">
          Discover Fragrances
        </Link>
      </PageWrap>
    )
  }

  return (
    <PageWrap className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <h1 className="font-display text-4xl text-ivory mb-12">Your Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {wishlist.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </PageWrap>
  )
}
