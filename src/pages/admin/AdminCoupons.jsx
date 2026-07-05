import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { couponsApi } from '../../lib/api'

const emptyForm = { code: '', type: 'percent', value: '', minOrder: 0, expiresAt: '', active: true }

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    couponsApi.list().then(setCoupons).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await couponsApi.create({
        ...form,
        value: Number(form.value),
        minOrder: Number(form.minOrder) || 0,
        expiresAt: form.expiresAt || null,
      })
      setForm(emptyForm)
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create coupon')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return
    await couponsApi.remove(id)
    load()
  }

  const toggleActive = async (coupon) => {
    await couponsApi.update(coupon._id, { active: !coupon.active })
    load()
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gold text-noir px-5 py-2 text-xs uppercase tracking-[0.2em] hover:bg-hover-glow transition-colors">
          <FiPlus /> New Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-gold/20 p-6 mb-8 bg-charcoal grid sm:grid-cols-2 gap-5">
          <input required placeholder="CODE (e.g. ZENO20)" value={form.code} onChange={(e) => update('code', e.target.value.toUpperCase())} className="bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold" />
          <select value={form.type} onChange={(e) => update('type', e.target.value)} className="bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold">
            <option value="percent">Percent off (%)</option>
            <option value="fixed">Fixed amount off ($)</option>
          </select>
          <input required type="number" min="0" placeholder="Value" value={form.value} onChange={(e) => update('value', e.target.value)} className="bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold" />
          <input type="number" min="0" placeholder="Minimum order ($, optional)" value={form.minOrder} onChange={(e) => update('minOrder', e.target.value)} className="bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold" />
          <input type="date" value={form.expiresAt} onChange={(e) => update('expiresAt', e.target.value)} className="bg-noir border border-gold/20 px-3 py-2 text-sm text-ivory outline-none focus:border-gold" />
          {error && <p className="text-red-400 text-xs sm:col-span-2">{error}</p>}
          <div className="sm:col-span-2 flex gap-4">
            <button type="submit" className="bg-gold text-noir px-6 py-2 text-xs uppercase tracking-[0.2em] hover:bg-hover-glow transition-colors">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gold/30 text-ivory px-6 py-2 text-xs uppercase tracking-[0.2em]">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-grey text-sm">Loading coupons…</p>
      ) : (
        <div className="overflow-x-auto border border-gold/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-grey border-b border-gold/10">
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Active</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b border-gold/5">
                  <td className="p-4 text-gold">{c.code}</td>
                  <td className="p-4 text-ivory">{c.type === 'percent' ? `${c.value}%` : `$${c.value}`}</td>
                  <td className="p-4 text-grey">{c.minOrder ? `$${c.minOrder}` : '—'}</td>
                  <td className="p-4 text-grey">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(c)} className={`text-xs px-2 py-1 border ${c.active ? 'border-gold text-gold' : 'border-grey/30 text-grey'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(c._id)} aria-label="Delete" className="text-ivory hover:text-red-400 transition-colors"><FiTrash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && <p className="text-grey text-sm p-8 text-center">No coupons yet.</p>}
        </div>
      )}
    </div>
  )
}
