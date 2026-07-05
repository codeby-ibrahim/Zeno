import { useState } from 'react'
import { productsApi, API_URL } from '../../lib/api'

const CATEGORIES = ['Men', 'Women', 'Oud', 'Luxury']
const emptyForm = {
  name: '',
  category: 'Men',
  price: '',
  oldPrice: '',
  discount: 0,
  stock: 0,
  bestSeller: false,
  isNew: true,
  liquidColor: '#D4AF37',
  image: '',
  longevity: '',
  projection: '',
  season: '',
  occasion: '',
  topNotes: '',
  middleNotes: '',
  baseNotes: '',
}

export default function ProductForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? {
          ...emptyForm,
          ...initial,
          topNotes: initial.notes?.top?.join(', ') || '',
          middleNotes: initial.notes?.middle?.join(', ') || '',
          baseNotes: initial.notes?.base?.join(', ') || '',
        }
      : emptyForm
  )
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { path } = await productsApi.upload(file)
      update('image', path)
    } catch (err) {
      setError(err.response?.data?.error || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      discount: Number(form.discount) || 0,
      stock: Number(form.stock) || 0,
      bestSeller: !!form.bestSeller,
      isNew: !!form.isNew,
      liquidColor: form.liquidColor,
      image: form.image,
      longevity: form.longevity,
      projection: form.projection,
      season: form.season,
      occasion: form.occasion,
      notes: {
        top: form.topNotes.split(',').map((s) => s.trim()).filter(Boolean),
        middle: form.middleNotes.split(',').map((s) => s.trim()).filter(Boolean),
        base: form.baseNotes.split(',').map((s) => s.trim()).filter(Boolean),
      },
    }

    try {
      if (initial?._id) {
        await productsApi.update(initial._id, payload)
      } else {
        await productsApi.create(payload)
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save product')
    } finally {
      setSaving(false)
    }
  }

  const imgSrc = form.image ? (form.image.startsWith('http') ? form.image : `${API_URL}${form.image}`) : ''

  return (
    <form onSubmit={handleSubmit} className="border border-gold/20 p-8 space-y-6 bg-charcoal">
      <h2 className="font-display text-2xl text-ivory">{initial ? 'Edit Product' : 'Add New Product'}</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-wide text-grey block mb-1">Name</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold" />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-grey block mb-1">Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-grey block mb-1">Price ($)</label>
              <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-grey block mb-1">Old Price ($, optional)</label>
              <input type="number" min="0" step="0.01" value={form.oldPrice || ''} onChange={(e) => update('oldPrice', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-grey block mb-1">Discount (%)</label>
              <input type="number" min="0" max="90" value={form.discount} onChange={(e) => update('discount', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-grey block mb-1">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input type="checkbox" checked={form.bestSeller} onChange={(e) => update('bestSeller', e.target.checked)} className="accent-[#D4AF37]" />
              Best Seller
            </label>
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input type="checkbox" checked={form.isNew} onChange={(e) => update('isNew', e.target.checked)} className="accent-[#D4AF37]" />
              Mark as New
            </label>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-wide text-grey block mb-1">Product Image</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="text-xs text-grey" />
            {uploading && <p className="text-xs text-gold mt-1">Uploading…</p>}
            {imgSrc && <img src={imgSrc} alt="Preview" className="w-24 h-24 object-cover mt-3 border border-gold/20" />}
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-grey block mb-1">Bottle Accent Color (used if no image)</label>
            <input type="color" value={form.liquidColor} onChange={(e) => update('liquidColor', e.target.value)} className="w-16 h-9 bg-noir border border-gold/20" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Longevity" value={form.longevity} onChange={(e) => update('longevity', e.target.value)} className="bg-noir border border-gold/20 px-2 py-2 text-xs text-ivory outline-none focus:border-gold" />
            <input placeholder="Projection" value={form.projection} onChange={(e) => update('projection', e.target.value)} className="bg-noir border border-gold/20 px-2 py-2 text-xs text-ivory outline-none focus:border-gold" />
            <input placeholder="Season" value={form.season} onChange={(e) => update('season', e.target.value)} className="bg-noir border border-gold/20 px-2 py-2 text-xs text-ivory outline-none focus:border-gold" />
          </div>
          <input placeholder="Occasion" value={form.occasion} onChange={(e) => update('occasion', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-xs text-ivory outline-none focus:border-gold" />

          <input placeholder="Top notes (comma separated)" value={form.topNotes} onChange={(e) => update('topNotes', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-xs text-ivory outline-none focus:border-gold" />
          <input placeholder="Middle notes (comma separated)" value={form.middleNotes} onChange={(e) => update('middleNotes', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-xs text-ivory outline-none focus:border-gold" />
          <input placeholder="Base notes (comma separated)" value={form.baseNotes} onChange={(e) => update('baseNotes', e.target.value)} className="w-full bg-noir border border-gold/20 px-3 py-2 text-xs text-ivory outline-none focus:border-gold" />
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={saving || uploading} className="bg-gold text-noir px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-hover-glow transition-colors disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Product'}
        </button>
        <button type="button" onClick={onCancel} className="border border-gold/30 text-ivory px-8 py-3 text-xs uppercase tracking-[0.25em] hover:border-gold transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
