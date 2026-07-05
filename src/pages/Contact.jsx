import { useState } from 'react'
import PageWrap from '../components/PageWrap'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <PageWrap className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-3">Get in Touch</p>
        <h1 className="font-display text-4xl md:text-5xl text-ivory">Contact ZENO</h1>
        <p className="text-grey text-sm mt-4">hello@zeno-parfums.com &middot; Mon&ndash;Fri, 9am&ndash;6pm</p>
      </div>

      {sent ? (
        <p className="text-center text-soft-gold py-16">Thank you \u2014 our team will respond within 24 hours.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <input required placeholder="Full name" className="bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none transition-colors" />
            <input required type="email" placeholder="Email address" className="bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none transition-colors" />
          </div>
          <input placeholder="Subject" className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none transition-colors" />
          <textarea required rows={5} placeholder="Message" className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none transition-colors resize-none" />
          <button type="submit" className="btn-ripple bg-gold text-noir px-10 py-3 text-xs uppercase tracking-[0.25em] hover:bg-hover-glow transition-colors">
            Send Message
          </button>
        </form>
      )}
    </PageWrap>
  )
}
