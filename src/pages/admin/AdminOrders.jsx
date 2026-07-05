import { useEffect, useState } from 'react'
import { ordersApi } from '../../lib/api'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    ordersApi
      .list()
      .then(setOrders)
      .catch(() => setError('Could not load orders.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleStatusChange = async (id, status) => {
    await ordersApi.updateStatus(id, status)
    load()
  }

  if (loading) return <p className="text-grey text-sm">Loading orders…</p>
  if (error) return <p className="text-red-400 text-sm">{error}</p>

  return (
    <div className="overflow-x-auto border border-gold/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-grey border-b border-gold/10">
            <th className="p-4">Order #</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Items</th>
            <th className="p-4">Total</th>
            <th className="p-4">Payment</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b border-gold/5 align-top">
              <td className="p-4 text-gold">{o.orderNumber}</td>
              <td className="p-4 text-ivory">
                {o.customer.name}
                <p className="text-xs text-grey">{o.customer.email}</p>
                <p className="text-xs text-grey">{o.customer.phone}</p>
              </td>
              <td className="p-4 text-grey">
                {o.items.map((i) => <p key={i.name}>{i.name} × {i.qty}</p>)}
              </td>
              <td className="p-4 text-gold">${o.total.toFixed(2)}</td>
              <td className="p-4 text-grey text-xs">{o.paymentMethod}</td>
              <td className="p-4">
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  className="bg-noir border border-gold/20 text-xs text-ivory px-2 py-1 outline-none"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="p-4 text-grey text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="text-grey text-sm p-8 text-center">No orders yet.</p>}
    </div>
  )
}
