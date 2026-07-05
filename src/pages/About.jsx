import PageWrap from '../components/PageWrap'
import BottleArt from '../components/BottleArt'

const pillars = [
  { title: 'Rare Materials', body: 'Agarwood, saffron and ambergris sourced directly from growers we\u2019ve worked with for years.' },
  { title: 'Patient Craft', body: 'Every composition rests for months before it earns the ZENO name.' },
  { title: 'Honest Bottling', body: 'No fillers, no shortcuts \u2014 concentration levels stated plainly on every label.' },
]

export default function About() {
  return (
    <PageWrap className="pt-32 pb-24">
      <section className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-4">Our Story</p>
        <h1 className="font-display text-4xl md:text-6xl text-ivory leading-tight">
          Crafted for those who <span className="text-gold-gradient italic">need no introduction</span>
        </h1>
        <p className="text-grey mt-8 leading-relaxed max-w-2xl mx-auto">
          ZENO was founded on a simple belief: that a fragrance should be as considered as the
          person wearing it. We work with a small circle of perfumers and rare-material growers
          across the world to compose scents that feel inevitable, never trendy.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 mt-24 flex justify-center">
        <BottleArt liquidColor="#D4AF37" className="w-56 bottle-float" />
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-24 grid md:grid-cols-3 gap-10">
        {pillars.map((p) => (
          <div key={p.title} className="border border-gold/10 p-8 text-center hover:border-gold/30 transition-colors">
            <h3 className="font-display text-2xl text-gold mb-3">{p.title}</h3>
            <p className="text-sm text-grey leading-relaxed">{p.body}</p>
          </div>
        ))}
      </section>
    </PageWrap>
  )
}
