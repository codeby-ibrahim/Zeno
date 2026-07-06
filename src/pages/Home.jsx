import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import PageWrap from '../components/PageWrap'
import ProductCard from '../components/ProductCard'
import { categories } from '../data/products'
import { useProducts } from '../hooks/useProducts'

function Particles({ count = 22 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 10,
      })),
    [count]
  )
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden bg-gold-fade"
    >
      {/* Mobile only: video as a soft background so text stays readable and
          nothing looks cramped on small screens. Desktop layout below is
          untouched. */}
      <div className="absolute inset-0 md:hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          className="w-full h-full object-cover opacity-35"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-noir/60 via-noir/70 to-noir/90" />
      </div>

      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(212,175,55,0.18) 0%, transparent 55%)',
        }}
      />
      <Particles />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xs md:text-sm uppercase tracking-widest2 text-soft-gold mb-6"
        >
          An International Fragrance House
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl leading-[0.95] text-gold-gradient font-medium"
        >
          ZENO
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.9 }}
          className="font-display italic text-xl md:text-2xl text-ivory/90 mt-6"
        >
          Crafted Beyond Luxury
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-5 mt-12"
        >
          <Link
            to="/shop"
            className="btn-ripple border border-gold text-gold px-9 py-3 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-noir transition-colors"
          >
            Shop Now
          </Link>
          <Link
            to="/collections"
            className="text-ivory/80 text-xs uppercase tracking-[0.25em] hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-1"
          >
            Explore Collection
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        style={{
          y: videoY,
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 45%, black 55%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 45%, black 55%, transparent 100%)',
        }}
        className="absolute right-[2%] bottom-0 hidden md:block w-[280px] lg:w-[360px]"
      >
        <video autoPlay muted loop playsInline poster="/hero-poster.jpg" className="w-full h-auto object-contain">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-grey text-[10px] uppercase tracking-widest2"
      >
        Scroll
      </motion.div>
    </section>
  )
}

function CollectionsStrip() {
  const cats = categories.filter((c) => c !== 'All')
  const blurb = {
    Men: 'Bold, structured, unmistakably ZENO.',
    Women: 'Florals rendered with restraint and depth.',
    Oud: 'Rare agarwood, sourced and aged with patience.',
    Luxury: 'The house\u2019s rarest compositions.',
  }
  const image = {
    Men: '/collection-men.png',
    Women: '/collection-women.png',
    Oud: '/collection-oud.png',
    Luxury: '/collection-luxury.png',
  }
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-3">Collections</p>
        <h2 className="font-display text-4xl md:text-5xl text-ivory">Four Houses, One Signature</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cats.map((c, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Link
              to="/shop"
              className="group relative block aspect-[3/4] bg-charcoal border border-gold/10 hover:border-gold/40 transition-colors overflow-hidden"
            >
              <img
                src={image[c]}
                alt={c}
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-noir via-noir/80 to-transparent">
                <h3 className="font-display text-2xl text-ivory">{c}</h3>
                <p className="text-xs text-grey mt-1">{blurb[c]}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function BestSellers() {
  const { products } = useProducts()
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4)
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-gold mb-3">Best Sellers</p>
          <h2 className="font-display text-4xl md:text-5xl text-ivory">Most Coveted</h2>
        </div>
        <Link to="/shop" className="hidden sm:block text-xs uppercase tracking-[0.2em] text-ivory/70 hover:text-gold transition-colors">
          View All &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {bestSellers.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}

function Manifesto() {
  return (
    <section className="relative py-32 border-y border-gold/10 bg-charcoal">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-6">The House</p>
        <p className="font-display text-3xl md:text-5xl leading-tight text-ivory">
          Every ZENO bottle is a study in restraint &mdash; rare materials, aged with patience,
          composed for the person who <span className="text-gold-gradient italic">needs no introduction</span>.
        </p>
        <Link
          to="/about"
          className="inline-block mt-10 text-xs uppercase tracking-[0.25em] text-gold border-b border-gold/40 hover:border-gold pb-1 transition-colors"
        >
          Our Story
        </Link>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <PageWrap>
      <Hero />
      <CollectionsStrip />
      <BestSellers />
      <Manifesto />
    </PageWrap>
  )
}