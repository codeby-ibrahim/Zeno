import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX, FiVolume2, FiVolumeX } from 'react-icons/fi'
import useStore from '../store/useStore'

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const cartCount = useStore((s) => s.cartCount())
  const wishlistCount = useStore((s) => s.wishlist.length)
  const soundOn = useStore((s) => s.soundOn)
  const toggleSound = useStore((s) => s.toggleSound)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`w-full z-50 transition-all duration-500 ${scrolled ? 'bg-noir/90 backdrop-blur-md border-b border-gold/10 py-3' : 'bg-transparent py-6'
        }`}
    >

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl md:text-3xl tracking-widest2 text-gold-gradient font-medium">
          ZENO
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-gold' : 'text-ivory/80 hover:text-gold'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-ivory">
          <button aria-label="Toggle ambient sound" onClick={toggleSound} className="hidden sm:block hover:text-gold transition-colors">
            {soundOn ? <FiVolume2 size={18} /> : <FiVolumeX size={18} />}
          </button>
          <Link to="/shop" aria-label="Search products" className="hover:text-gold transition-colors">
            <FiSearch size={18} />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="relative hover:text-gold transition-colors">
            <FiHeart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-noir text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative hover:text-gold transition-colors">
            <FiShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-noir text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="lg:hidden hover:text-gold transition-colors" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-noir border-t border-gold/10 mt-4">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.2em] text-ivory/80 hover:text-gold py-1"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
