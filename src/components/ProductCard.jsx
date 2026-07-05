import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import BottleArt from './BottleArt'
import useStore from '../store/useStore'

export default function ProductCard({ product, index = 0 }) {
  const toggleWishlist = useStore((s) => s.toggleWishlist)
  const isWishlisted = useStore((s) => s.isWishlisted(product.id))
  const lowStock = product.stock <= 5

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative"
    >
      <div className="relative bg-charcoal rounded-sm overflow-hidden border border-gold/10 group-hover:border-gold/30 transition-colors">
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-gold text-noir text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm">
            -{product.discount}%
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-3 right-11 z-10 bg-ivory text-noir text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm">
            New
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-noir/60 hover:bg-noir transition-colors"
        >
          <FiHeart size={14} className={isWishlisted ? 'fill-gold text-gold' : 'text-ivory'} />
        </button>

        <Link to={`/product/${product.id}`} className="block aspect-[3/4] flex items-center justify-center p-6 overflow-hidden">
          {product.image ? (
            <img
              src={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1"
            />
          ) : (
            <BottleArt
              liquidColor={product.liquidColor}
              className="h-full w-auto transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1"
            />
          )}
        </Link>

        {lowStock && (
          <p className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wider text-hover-glow">
            Only {product.stock} left
          </p>
        )}
      </div>

      <div className="pt-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-grey">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-xl text-ivory mt-1 hover:text-gold transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-gold">${product.price}</span>
          {product.oldPrice && <span className="text-grey/60 line-through text-sm">${product.oldPrice}</span>}
        </div>
      </div>
    </motion.div>
  )
}
