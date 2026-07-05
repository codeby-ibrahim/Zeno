import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaTiktok, FaFacebookF, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3500)
  }

  return (
    <footer className="bg-charcoal border-t border-gold/10 pt-20 pb-8 mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 pb-16">
          <div className="md:col-span-2">
            <h3 className="font-display text-3xl text-gold-gradient tracking-widest2 mb-4">ZENO</h3>
            <p className="text-grey text-sm max-w-sm leading-relaxed">
              Crafted beyond luxury. An international fragrance house devoted to rare oud,
              timeless florals and bold orientals — bottled with intention.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 flex max-w-sm border-b border-gold/30 focus-within:border-gold transition-colors">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="bg-transparent flex-1 py-2 text-sm text-ivory placeholder:text-grey/60 outline-none"
              />
              <button type="submit" className="text-xs uppercase tracking-widest text-gold px-2 hover:text-hover-glow transition-colors">
                Join
              </button>
            </form>
            {sent && <p className="text-xs text-soft-gold mt-2">You're on the list. Welcome to ZENO.</p>}
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-5">Explore</h4>
            <ul className="space-y-3 text-sm text-grey">
              <li><Link to="/shop" className="hover:text-gold transition-colors">Shop All</Link></li>
              <li><Link to="/collections" className="hover:text-gold transition-colors">Collections</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link to="/blog" className="hover:text-gold transition-colors">Journal</Link></li>
              <li><Link to="/track-order" className="hover:text-gold transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-5">Support</h4>
            <ul className="space-y-3 text-sm text-grey">
              <li><Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-gold transition-colors">Refund Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-gold transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gold/10">
          <p className="text-xs text-grey/70">
            © {new Date().getFullYear()} ZENO. All rights reserved.
            {' '}·{' '}
            <Link to="/admin/login" className="hover:text-gold transition-colors">Admin</Link>
          </p>
          <div className="flex items-center gap-5 text-ivory">
            <a href="https://wa.me/10000000000" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-gold transition-colors"><FaWhatsapp size={16} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-gold transition-colors"><FaInstagram size={16} /></a>
            <a href="#" aria-label="TikTok" className="hover:text-gold transition-colors"><FaTiktok size={16} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-gold transition-colors"><FaFacebookF size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
