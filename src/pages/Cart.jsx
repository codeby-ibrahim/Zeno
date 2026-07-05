import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2 } from 'react-icons/fi'
import PageWrap from '../components/PageWrap'
import BottleArt from '../components/BottleArt'
import useStore from '../store/useStore'

export default function Cart() {
  const navigate = useNavigate()
  const cart = useStore((s) => s.cart)
  const removeFromCart = useStore((s) => s.removeFromCart)
  const updateQty = useStore((s) => s.updateQty)
  const total = useStore((s) => s.cartTotal())

  if (cart.length === 0) {
    return (
      <PageWrap className="pt-40 pb-32 text-center max-w-xl mx-auto px-6">
        <h1 className="font-display text-3xl text-ivory mb-4">Your bag is empty</h1>
        <p className="text-grey text-sm mb-8">Discover a fragrance worth carrying.</p>
        <Link to="/shop" className="border border-gold text-gold px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-noir transition-colors">
          Shop Fragrances
        </Link>
      </PageWrap>
    )
  }

  return (
    <PageWrap className="pt-32 pb-24 max-w-5xl mx-auto px-6">
      <h1 className="font-display text-4xl text-ivory mb-12">Your Bag</h1>
      <div className="space-y-6">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-6 border-b border-gold/10 pb-6">
            <div className="w-20 h-24 bg-charcoal shrink-0 flex items-center justify-center">
              <BottleArt liquidColor={item.liquidColor} glow={false} className="h-full w-auto" />
            </div>
            <div className="flex-1">
              <Link to={`/product/${item.id}`} className="font-display text-xl text-ivory hover:text-gold transition-colors">{item.name}</Link>
              <p className="text-xs text-grey">{item.category}</p>
            </div>
            <div className="flex items-center border border-gold/20">
              <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-3 py-1 text-ivory hover:text-gold">−</button>
              <span className="px-3 text-ivory text-sm">{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-3 py-1 text-ivory hover:text-gold">+</button>
            </div>
            <span className="text-gold w-16 text-right">${item.price * item.qty}</span>
            <button onClick={() => removeFromCart(item.id)} aria-label="Remove" className="text-grey hover:text-red-400 transition-colors">
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-end mt-12 gap-4">
        <div className="flex gap-8 text-sm">
          <span className="text-grey">Subtotal</span>
          <span className="text-ivory">${total.toFixed(2)}</span>
        </div>
        <p className="text-xs text-grey">Shipping and taxes calculated at checkout.</p>
        <button
          onClick={() => navigate('/checkout')}
          className="btn-ripple bg-gold text-noir px-10 py-3 text-xs uppercase tracking-[0.25em] hover:bg-hover-glow transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </PageWrap>
  )
}
