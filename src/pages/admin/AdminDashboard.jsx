import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiDownload } from 'react-icons/fi'
import { productsApi, auth, API_URL } from '../../lib/api'
import mockProducts from '../../data/products'
import ProductForm from './ProductForm'
import AdminOrders from './AdminOrders'
import AdminCoupons from './AdminCoupons'
import AdminBlog from './AdminBlog'

const TABS = ['Products', 'Orders', 'Coupons', 'Blog']

function ProductsTab() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [seeding, setSeeding] = useState(false)

  const load = () => {
    setLoading(true)
    productsApi
      .list()
      .then(setProducts)
      .catch((err) => setError(err.response?.data?.error || 'Could not reach Firebase. Check your Firebase config in .env.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    await productsApi.remove(id)
    load()
  }

  const handleSaved = () => {
    setEditing(null)
    load()
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      for (const p of mockProducts) {
        // eslint-disable-next-line no-await-in-loop
        await productsApi.create({
          name: p.name,
          category: p.category,
          price: p.price,
          oldPrice: p.oldPrice || null,
          discount: p.discount || 0,
          stock: p.stock,
          bestSeller: p.bestSeller,
          isNew: p.isNew,
          liquidColor: p.liquidColor,
          notes: p.notes,
          longevity: p.longevity,
          projection: p.projection,
          season: p.season,
          occasion: p.occasion,
          rating: p.rating,
          reviews: p.reviews,
        })
      }
      load()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load sample products')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div>
      <div className="flex justify-end gap-4 mb-6">
        {products.length === 0 && !loading && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 border border-gold/40 text-gold px-5 py-2 text-xs uppercase tracking-[0.2em] hover:bg-gold/10 transition-colors disabled:opacity-60"
          >
            <FiDownload /> {seeding ? 'Loading…' : 'Load Sample Products'}
          </button>
        )}
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-2 bg-gold text-noir px-5 py-2 text-xs uppercase tracking-[0.2em] hover:bg-hover-glow transition-colors"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      {editing !== null && (
        <div className="mb-10">
          <ProductForm initial={editing._id ? editing : null} onSaved={handleSaved} onCancel={() => setEditing(null)} />
        </div>
      )}

      {error && <p className="text-red-400 text-sm mb-6">{error}</p>}

      {loading ? (
        <p className="text-grey text-sm">Loading products…</p>
      ) : (
        <div className="overflow-x-auto border border-gold/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-grey border-b border-gold/10">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-gold/5">
                  <td className="p-4">
                    {p.image ? (
                      <img src={p.image.startsWith('http') ? p.image : `${API_URL}${p.image}`} alt={p.name} className="w-12 h-12 object-cover" />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center border border-gold/10" style={{ background: p.liquidColor }} />
                    )}
                  </td>
                  <td className="p-4 text-ivory">{p.name}</td>
                  <td className="p-4 text-grey">{p.category}</td>
                  <td className="p-4 text-gold">${p.price}{p.oldPrice ? <span className="text-grey line-through ml-2">${p.oldPrice}</span> : null}</td>
                  <td className="p-4 text-grey">{p.discount ? `${p.discount}%` : '—'}</td>
                  <td className="p-4 text-grey">{p.stock}</td>
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
          {products.length === 0 && <p className="text-grey text-sm p-8 text-center">No products yet. Click "Add Product" to create your first one.</p>}
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('Products')
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-noir pt-10 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-gold-gradient">ZENO Admin</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 border border-gold/30 text-ivory px-5 py-2 text-xs uppercase tracking-[0.2em] hover:border-gold transition-colors">
            <FiLogOut /> Logout
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gold/10">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-xs uppercase tracking-[0.2em] border-b-2 transition-colors ${
                tab === t ? 'border-gold text-gold' : 'border-transparent text-grey hover:text-ivory'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Products' && <ProductsTab />}
        {tab === 'Orders' && <AdminOrders />}
        {tab === 'Coupons' && <AdminCoupons />}
        {tab === 'Blog' && <AdminBlog />}
      </div>
    </div>
  )
}
