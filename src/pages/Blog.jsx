import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageWrap from '../components/PageWrap'
import { postsApi, API_URL } from '../lib/api'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    postsApi
      .list()
      .then(setPosts)
      .catch(() => setError('Could not load the journal right now.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrap className="pt-32 pb-24 max-w-5xl mx-auto px-6">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-3">Journal</p>
        <h1 className="font-display text-4xl md:text-5xl text-ivory">Notes from the House</h1>
      </div>

      {loading && <p className="text-grey text-sm text-center">Loading…</p>}
      {error && <p className="text-grey text-sm text-center">{error}</p>}
      {!loading && posts.length === 0 && !error && (
        <p className="text-grey text-sm text-center">No journal entries yet — check back soon.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-10">
        {posts.map((post) => (
          <Link key={post._id} to={`/blog/${post.slug}`} className="group">
            {post.coverImage && (
              <div className="aspect-[16/10] bg-charcoal overflow-hidden mb-4">
                <img
                  src={post.coverImage.startsWith('http') ? post.coverImage : `${API_URL}${post.coverImage}`}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <h2 className="font-display text-2xl text-ivory group-hover:text-gold transition-colors">{post.title}</h2>
            {post.excerpt && <p className="text-sm text-grey mt-2 line-clamp-2">{post.excerpt}</p>}
          </Link>
        ))}
      </div>
    </PageWrap>
  )
}
