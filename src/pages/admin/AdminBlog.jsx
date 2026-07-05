import { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { postsApi, API_URL } from '../../lib/api'

const emptyForm = { title: '', excerpt: '', content: '', coverImage: '', published: true }

function PostForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { path } = await postsApi.upload(file)
      update('coverImage', path)
    } catch {
      setError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (initial?._id) await postsApi.update(initial._id, form)
      else await postsApi.create(form)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save post')
    } finally {
      setSaving(false)
    }
  }

  const imgSrc = form.coverImage ? (form.coverImage.startsWith('http') ? form.coverImage : `${API_URL}${form.coverImage}`) : ''

  return (
    <form onSubmit={handleSubmit} className="border border-gold/20 p-6 mb-8 bg-charcoal space-y-4">
      <input required placeholder="Title" value={form.title} onChange={(e) => update('title', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold" />
      <input placeholder="Excerpt (short summary)" value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold" />
      <textarea required rows={8} placeholder="Post content" value={form.content} onChange={(e) => update('content', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold resize-none" />

      <div>
        <label className="text-xs uppercase tracking-wide text-grey block mb-1">Cover image</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="text-xs text-grey" />
        {uploading && <p className="text-xs text-gold mt-1">Uploading…</p>}
        {imgSrc && <img src={imgSrc} alt="Preview" className="w-32 h-20 object-cover mt-3 border border-gold/20" />}
      </div>

      <label className="flex items-center gap-2 text-sm text-ivory">
        <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="accent-[#D4AF37]" />
        Published
      </label>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex gap-4">
        <button type="submit" disabled={saving || uploading} className="bg-gold text-noir px-6 py-2 text-xs uppercase tracking-[0.2em] hover:bg-hover-glow transition-colors disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Post'}
        </button>
        <button type="button" onClick={onCancel} className="border border-gold/30 text-ivory px-6 py-2 text-xs uppercase tracking-[0.2em]">Cancel</button>
      </div>
    </form>
  )
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  const load = () => {
    setLoading(true)
    postsApi.list(true).then(setPosts).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    await postsApi.remove(id)
    load()
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={() => setEditing({})} className="flex items-center gap-2 bg-gold text-noir px-5 py-2 text-xs uppercase tracking-[0.2em] hover:bg-hover-glow transition-colors">
          <FiPlus /> New Post
        </button>
      </div>

      {editing !== null && (
        <PostForm
          initial={editing._id ? editing : null}
          onSaved={() => { setEditing(null); load() }}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <p className="text-grey text-sm">Loading posts…</p>
      ) : (
        <div className="overflow-x-auto border border-gold/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-grey border-b border-gold/10">
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id} className="border-b border-gold/5">
                  <td className="p-4 text-ivory">{p.title}</td>
                  <td className="p-4 text-grey">{p.published ? 'Published' : 'Draft'}</td>
                  <td className="p-4 text-grey text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => setEditing(p)} aria-label="Edit" className="text-ivory hover:text-gold transition-colors"><FiEdit2 size={15} /></button>
                      <button onClick={() => handleDelete(p._id)} aria-label="Delete" className="text-ivory hover:text-red-400 transition-colors"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && <p className="text-grey text-sm p-8 text-center">No posts yet.</p>}
        </div>
      )}
    </div>
  )
}
