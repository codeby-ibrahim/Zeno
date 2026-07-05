import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageWrap from '../components/PageWrap'
import { postsApi, API_URL } from '../lib/api'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    postsApi
      .get(slug)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <PageWrap className="pt-40 pb-24 text-center text-grey text-sm">Loading…</PageWrap>

  if (notFound || !post) {
    return (
      <PageWrap className="pt-40 pb-24 text-center">
        <p className="text-grey">This journal entry couldn't be found.</p>
        <Link to="/blog" className="text-gold text-sm mt-4 inline-block">Back to Journal</Link>
      </PageWrap>
    )
  }

  return (
    <PageWrap className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <p className="text-xs uppercase tracking-widest2 text-gold mb-3 text-center">Journal</p>
      <h1 className="font-display text-4xl md:text-5xl text-ivory text-center mb-10">{post.title}</h1>

      {post.coverImage && (
        <div className="aspect-[16/9] bg-charcoal overflow-hidden mb-10">
          <img
            src={post.coverImage.startsWith('http') ? post.coverImage : `${API_URL}${post.coverImage}`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="text-grey leading-relaxed whitespace-pre-line text-[15px]">
        {post.content}
      </div>

      <div className="mt-16 text-center">
        <Link to="/blog" className="text-xs uppercase tracking-[0.2em] text-gold border-b border-gold/40 pb-1">
          Back to Journal
        </Link>
      </div>
    </PageWrap>
  )
}
