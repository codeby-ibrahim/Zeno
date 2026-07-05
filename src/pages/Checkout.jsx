import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageWrap from '../components/PageWrap'
import useStore from '../store/useStore'
import { ordersApi, couponsApi } from '../lib/api'

const emptyCustomer = { name: '', email: '', phone: '', address: '', city: '', country: '', notes: '' }

export default function Checkout() {
  const cart = useStore((s) => s.cart)
  const subtotal = useStore((s) => s.cartTotal())
  const navigate = useNavigate()

  const [customer, setCustomer] = useState(emptyCustomer)
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [applying, setApplying] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  const discount = coupon?.discountAmount || 0
  const total = Math.max(0, subtotal - discount)

  const update = (key, value) => setCustomer((c) => ({ ...c, [key]: value }))

  const applyCoupon = async () => {
    if (!couponCode) return
    setApplying(true)
    setCouponError('')
    try {
      const result = await couponsApi.validate(couponCode, subtotal)
      setCoupon(result)
    } catch (err) {
      setCoupon(null)
      setCouponError(err.response?.data?.error || 'Could not validate coupon')
    } finally {
      setApplying(false)
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setPlacing(true)
    setError('')
    try {
      const order = await ordersApi.create({
        customer,
        items: cart.map((i) => ({ productId: i.id, qty: i.qty })),
        couponCode: coupon?.code || null,
      })
      setConfirmedOrder(order)
      useStore.setState({ cart: [] })
    } catch (err) {
      setError(err.response?.data?.error || 'Could not place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (confirmedOrder) {
    return (
      <PageWrap className="pt-40 pb-32 max-w-lg mx-auto px-6 text-center">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-4">Order Confirmed</p>
        <h1 className="font-display text-4xl text-ivory mb-4">Thank you, {confirmedOrder.customer.name}</h1>
        <p className="text-grey text-sm mb-8">
          Your order <span className="text-gold">{confirmedOrder.orderNumber}</span> has been placed.
          A confirmation has been sent to {confirmedOrder.customer.email}.
        </p>
        <div className="border border-gold/10 p-6 text-left text-sm mb-8">
          <p className="text-grey">Total: <span className="text-gold">${confirmedOrder.total.toFixed(2)}</span></p>
          <p className="text-grey mt-1">Payment: {confirmedOrder.paymentMethod}</p>
        </div>
        <Link to="/track-order" className="text-gold text-xs uppercase tracking-[0.2em] border-b border-gold/40 pb-1">
          Track this order
        </Link>
      </PageWrap>
    )
  }

  if (cart.length === 0) {
    return (
      <PageWrap className="pt-40 pb-32 text-center max-w-xl mx-auto px-6">
        <h1 className="font-display text-3xl text-ivory mb-4">Your bag is empty</h1>
        <Link to="/shop" className="border border-gold text-gold px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-noir transition-colors">
          Shop Fragrances
        </Link>
      </PageWrap>
    )
  }

  return (
    <PageWrap className="pt-32 pb-24 max-w-5xl mx-auto px-6">
      <h1 className="font-display text-4xl text-ivory mb-12">Checkout</h1>
      <div className="grid lg:grid-cols-5 gap-12">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-3 space-y-5">
          <h2 className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Shipping Details</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <input required placeholder="Full name" value={customer.name} onChange={(e) => update('name', e.target.value)} className="bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none" />
            <input required type="email" placeholder="Email" value={customer.email} onChange={(e) => update('email', e.target.value)} className="bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none" />
          </div>
          <input required placeholder="Phone" value={customer.phone} onChange={(e) => update('phone', e.target.value)} className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none" />
          <input required placeholder="Street address" value={customer.address} onChange={(e) => update('address', e.target.value)} className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none" />
          <div className="grid sm:grid-cols-2 gap-5">
            <input required placeholder="City" value={customer.city} onChange={(e) => update('city', e.target.value)} className="bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none" />
            <input required placeholder="Country" value={customer.country} onChange={(e) => update('country', e.target.value)} className="bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none" />
          </div>
          <textarea placeholder="Order notes (optional)" rows={3} value={customer.notes} onChange={(e) => update('notes', e.target.value)} className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none resize-none" />

          <div className="pt-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Payment</p>
            <p className="text-sm text-grey border border-gold/10 p-4">Cash on Delivery — pay when your order arrives.</p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={placing} className="btn-ripple w-full bg-gold text-noir py-3 text-xs uppercase tracking-[0.25em] hover:bg-hover-glow transition-colors disabled:opacity-60">
            {placing ? 'Placing Order…' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="lg:col-span-2">
          <h2 className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Order Summary</h2>
          <div className="space-y-3 border-b border-gold/10 pb-4 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-ivory">{item.name} × {item.qty}</span>
                <span className="text-grey">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 bg-transparent border-b border-gold/20 focus:border-gold py-2 text-sm text-ivory placeholder:text-grey/60 outline-none"
            />
            <button type="button" onClick={applyCoupon} disabled={applying} className="text-xs uppercase tracking-wide text-gold border-b border-gold/40 hover:border-gold px-2 disabled:opacity-50">
              {applying ? '…' : 'Apply'}
            </button>
          </div>
          {couponError && <p className="text-red-400 text-xs mb-3">{couponError}</p>}
          {coupon && <p className="text-soft-gold text-xs mb-3">Coupon "{coupon.code}" applied — -${discount.toFixed(2)}</p>}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-grey"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-soft-gold"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
            <div className="flex justify-between text-ivory text-base pt-2 border-t border-gold/10"><span>Total</span><span className="text-gold">${total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </PageWrap>
  )
}
