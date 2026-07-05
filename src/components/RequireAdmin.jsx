import { Navigate } from 'react-router-dom'
import { auth } from '../lib/api'

export default function RequireAdmin({ children }) {
  if (!auth.isLoggedIn()) return <Navigate to="/admin/login" replace />
  return children
}
