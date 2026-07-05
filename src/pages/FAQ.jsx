import { useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'
import PageWrap from '../components/PageWrap'

const faqs = [
  { q: 'How long does shipping take?', a: 'Domestic orders arrive in 3\u20135 business days. International orders typically take 7\u201314 business days.' },
  { q: 'Are your fragrances authentic and cruelty-free?', a: 'Every ZENO fragrance is composed in-house and never tested on animals. Each bottle ships with an authentication card.' },
  { q: 'What is your return policy?', a: 'Unopened bottles can be returned within 30 days of delivery for a full refund. See our Refund Policy for details.' },
  { q: 'Can I order via WhatsApp?', a: 'Yes \u2014 tap the WhatsApp button on any product page to send us a pre-filled order message with the product, price and quantity.' },
  { q: 'Do you offer gift wrapping?', a: 'All ZENO orders arrive in a signed gift box with satin lining at no extra cost.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <PageWrap className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-3">Support</p>
        <h1 className="font-display text-4xl md:text-5xl text-ivory">Frequently Asked Questions</h1>
      </div>
      <div className="divide-y divide-gold/10 border-t border-b border-gold/10">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between py-5 text-left"
            >
              <span className="text-ivory font-display text-lg">{f.q}</span>
              {open === i ? <FiMinus className="text-gold shrink-0" /> : <FiPlus className="text-gold shrink-0" />}
            </button>
            {open === i && <p className="text-grey text-sm pb-5 leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
    </PageWrap>
  )
}
