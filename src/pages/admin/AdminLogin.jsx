import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../lib/api'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-noir px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-gold/20 p-10">
        <h1 className="font-display text-3xl text-gold-gradient text-center mb-1">ZENO</h1>
        <p className="text-xs uppercase tracking-widest2 text-grey text-center mb-8">Admin Dashboard</p>

        <div className="space-y-5">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none transition-colors"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-gold/20 focus:border-gold py-3 text-sm text-ivory placeholder:text-grey/60 outline-none transition-colors"
          />
        </div>

        {error && <p className="text-red-400 text-xs mt-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-gold text-noir py-3 text-xs uppercase tracking-[0.25em] hover:bg-hover-glow transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}