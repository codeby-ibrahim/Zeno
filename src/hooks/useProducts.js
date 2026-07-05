import { useEffect, useState } from 'react'
import { productsApi } from '../lib/api'
import mockProducts from '../data/products'

// Fetches the live catalogue from the backend. Falls back to the local mock
// data if the API is unreachable, so the storefront still renders while the
// backend isn't running yet.
export function useProducts(params) {
  const [products, setProducts] = useState(mockProducts)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    productsApi
      .list(params)
      .then((data) => {
        if (!cancelled) {
          setProducts(data.map((p) => ({ ...p, id: p._id || p.slug })))
          setUsingFallback(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts(mockProducts)
          setUsingFallback(true)
        }
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)])

  return { products, loading, usingFallback }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    productsApi
      .get(id)
      .then((data) => !cancelled && setProduct({ ...data, id: data._id || data.slug }))
      .catch(() => {
        const fallback = mockProducts.find((p) => p.id === id)
        if (!cancelled) setProduct(fallback || null)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id])

  return { product, loading }
}
