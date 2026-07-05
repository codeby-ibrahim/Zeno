import { Link } from 'react-router-dom'
import PageWrap from '../components/PageWrap'

export default function NotFound() {
  return (
    <PageWrap className="pt-40 pb-32 text-center max-w-lg mx-auto px-6">
      <h1 className="font-display text-6xl text-gold-gradient mb-4">404</h1>
      <p className="text-grey mb-8">This page has drifted off, like the top notes of a fragrance.</p>
      <Link to="/" className="border border-gold text-gold px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-noir transition-colors">
        Return Home
      </Link>
    </PageWrap>
  )
}
