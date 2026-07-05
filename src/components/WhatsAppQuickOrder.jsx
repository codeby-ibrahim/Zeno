import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { ordersApi } from '../lib/api'
import { buildWhatsAppLink } from './WhatsAppButton'

export default function WhatsAppQuickOrder({ product, qty }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      // Save the order so it shows up in the admin dashboard's Orders tab.
      await ordersApi.create({
        customer: { name, phone, city, address: 'To be confirmed via WhatsApp', country: '' },
        items: [{ productId: product.id, qty }],
        paymentMethod: 'WhatsApp Order',
      })
    } catch (err) {
      // Even if saving fails (e.g. backend offline), still let the WhatsApp
      // message go through so the customer isn't blocked.
      console.error('Could not save WhatsApp order to dashboard:', err.message)
    } finally {
      setSubmitting(false)
      window.open(buildWhatsAppLink(product, qty), '_blank', 'noreferrer')
      setOpen(false)
      setName('')
      setPhone('')
      setCity('')
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full flex items-center justify-center gap-2 border border-[#25D366]/40 text-[#25D366] py-3 text-xs uppercase tracking-[0.25em] hover:bg-[#25D366]/10 transition-colors"
      >
        <FaWhatsapp /> Order on WhatsApp
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6">
          <form onSubmit={handleSubmit} className="bg-charcoal border border-gold/20 p-8 w-full max-w-sm relative">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute top-4 right-4 text-grey hover:text-ivory">
              <FiX />
            </button>
            <h3 className="font-display text-2xl text-ivory mb-1">Quick Order</h3>
            <p className="text-xs text-grey mb-6">We'll note your order and open WhatsApp to confirm details.</p>

            <div className="space-y-4">
              <input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-noir border-b border-gold/20 focus:border-gold py-2 text-sm text-ivory placeholder:text-grey/60 outline-none" />
              <input required placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-noir border-b border-gold/20 focus:border-gold py-2 text-sm text-ivory placeholder:text-grey/60 outline-none" />
              <input placeholder="City (optional)" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-noir border-b border-gold/20 focus:border-gold py-2 text-sm text-ivory placeholder:text-grey/60 outline-none" />
            </div>

            {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#25D366] text-noir py-3 text-xs uppercase tracking-[0.25em] hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              <FaWhatsapp /> {submitting ? 'Sending…' : 'Continue to WhatsApp'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
