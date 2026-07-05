import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiHeart, FiCheck, FiStar } from 'react-icons/fi'
import PageWrap from '../components/PageWrap'
import BottleArt from '../components/BottleArt'
import ProductCard from '../components/ProductCard'
import WhatsAppQuickOrder from '../components/WhatsAppQuickOrder'
import useStore from '../store/useStore'
import { useProduct, useProducts } from '../hooks/useProducts'

export default function Product() {
  const { id } = useParams()
  const { product, loading } = useProduct(id)
  const { products } = useProducts()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const addToCart = useStore((s) => s.addToCart)
  const toggleWishlist = useStore((s) => s.toggleWishlist)
  const isWishlisted = useStore((s) => s.isWishlisted(product?.id))

  useEffect(() => setQty(1), [id])

  if (loading) {
    return <PageWrap className="pt-40 pb-24 text-center text-grey text-sm">Loading fragrance…</PageWrap>
  }

  if (!product) {
    return (
      <PageWrap className="pt-40 pb-24 text-center">
        <p className="text-grey">Fragrance not found.</p>
        <Link to="/shop" className="text-gold text-sm mt-4 inline-block">Back to Shop</Link>
      </PageWrap>
    )
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAdd = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <PageWrap className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="lg:sticky lg:top-32 flex items-center justify-center bg-charcoal border border-gold/10 aspect-square p-12 overflow-hidden">
          {product.image ? (
            <img
              src={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <BottleArt liquidColor={product.liquidColor} className="h-full w-auto bottle-float" />
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-gold mb-3">{product.category}</p>
          <h1 className="font-display text-4xl md:text-5xl text-ivory">{product.name}</h1>

          <div className="flex items-center gap-2 mt-4 text-sm text-grey">
            <div className="flex text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} size={14} className={i < Math.round(product.rating) ? 'fill-gold' : ''} />
              ))}
            </div>
            <span>{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="font-display text-3xl text-gold">${product.price}</span>
            {product.oldPrice && <span className="text-grey line-through">${product.oldPrice}</span>}
            {product.discount > 0 && <span className="text-xs bg-gold text-noir px-2 py-1 uppercase tracking-wide">Save {product.discount}%</span>}
          </div>

          {product.stock <= 5 && (
            <p className="text-hover-glow text-xs uppercase tracking-wide mt-3">Only {product.stock} left in stock</p>
          )}

          <div className="grid grid-cols-3 gap-4 mt-8 text-xs">
            <div className="border border-gold/10 p-3">
              <p className="text-grey uppercase tracking-wide mb-1">Longevity</p>
              <p className="text-ivory">{product.longevity}</p>
            </div>
            <div className="border border-gold/10 p-3">
              <p className="text-grey uppercase tracking-wide mb-1">Projection</p>
              <p className="text-ivory">{product.projection}</p>
            </div>
            <div className="border border-gold/10 p-3">
              <p className="text-grey uppercase tracking-wide mb-1">Season</p>
              <p className="text-ivory">{product.season}</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {['top', 'middle', 'base'].map((tier) => (
              <div key={tier} className="flex gap-4 items-baseline">
                <span className="text-xs uppercase tracking-widest text-gold w-16 shrink-0">{tier}</span>
                <span className="text-sm text-grey">{product.notes[tier].join(', ')}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-10">
            <div className="flex items-center border border-gold/20">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-ivory hover:text-gold">−</button>
              <span className="px-4 text-ivory">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2 text-ivory hover:text-gold">+</button>
            </div>
            <button
              onClick={handleAdd}
              className="btn-ripple flex-1 bg-gold text-noir py-3 text-xs uppercase tracking-[0.25em] hover:bg-hover-glow transition-colors flex items-center justify-center gap-2"
            >
              {added ? (<><FiCheck /> Added</>) : 'Add to Cart'}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
              className="w-12 h-12 flex items-center justify-center border border-gold/20 hover:border-gold transition-colors shrink-0"
            >
              <FiHeart className={isWishlisted ? 'fill-gold text-gold' : 'text-ivory'} />
            </button>
          </div>

          <WhatsAppQuickOrder product={product} qty={qty} />

          <p className="text-xs text-grey mt-6 leading-relaxed">
            Occasion: {product.occasion} &middot; Presented in a signed ZENO gift box with satin lining and authentication card.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-32">
          <h2 className="font-display text-3xl text-ivory mb-10">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </PageWrap>
  )
}
