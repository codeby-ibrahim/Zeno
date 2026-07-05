import { useState } from 'react'
import PageWrap from '../components/PageWrap'
import { ordersApi } from '../lib/api'

const STAGES = ['Pending', 'Processing', 'Shipped', 'Delivered']

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const result = await ordersApi.track(orderNumber.trim(), email.trim())
      setOrder(result)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not find that order')
    } finally {
      setLoading(false)
    }
  }

  const stageIndex = order ? STAGES.indexOf(order.status) : -1

  return (
    <PageWrap className="pt-32 pb-24 max-w-2xl mx-auto px-6">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-3">Order Status</p>
        <h1 className="font-display text-4xl md:text-5xl text-ivory">Track Your Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-10">
        <input
          required
          placeholder="Order number (e.g. ZN-482913)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="flex-1 bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none"
        />
        <input
          required
          type="email"
          placeholder="Email used for the order"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none"
        />
        <button type="submit" disabled={loading} className="bg-gold text-noir px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-hover-glow transition-colors disabled:opacity-60">
          {loading ? '…' : 'Track'}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {order && (
        <div className="border border-gold/10 p-8">
          <div className="flex justify-between items-baseline mb-8">
            <div>
              <p className="text-xs text-grey">Order</p>
              <p className="font-display text-2xl text-gold">{order.orderNumber}</p>
            </div>
            <p className="text-sm text-grey">${order.total.toFixed(2)}</p>
          </div>

          {order.status === 'Cancelled' ? (
            <p className="text-red-400 text-sm">This order has been cancelled.</p>
          ) : (
            <div className="flex items-center justify-between">
              {STAGES.map((stage, i) => (
                <div key={stage} className="flex-1 flex flex-col items-center relative">
                  {i > 0 && (
                    <div className={`absolute top-2 right-1/2 w-full h-px ${i <= stageIndex ? 'bg-gold' : 'bg-gold/15'}`} />
                  )}
                  <div className={`w-4 h-4 rounded-full z-10 ${i <= stageIndex ? 'bg-gold' : 'bg-charcoal border border-gold/30'}`} />
                  <p className={`text-[10px] uppercase tracking-wide mt-3 text-center ${i <= stageIndex ? 'text-ivory' : 'text-grey'}`}>{stage}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gold/10 space-y-2 text-sm text-grey">
            {order.items.map((item) => (
              <div key={item.name} className="flex justify-between">
                <span>{item.name} × {item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageWrap>
  )
}
