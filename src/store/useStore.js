import { create } from 'zustand'

const useStore = create((set, get) => ({
  cart: [],
  wishlist: [],
  soundOn: false,

  addToCart: (product, qty = 1) => {
    const cart = [...get().cart]
    const existing = cart.find((i) => i.id === product.id)
    if (existing) {
      existing.qty += qty
    } else {
      cart.push({ ...product, qty })
    }
    set({ cart })
  },

  removeFromCart: (id) => set({ cart: get().cart.filter((i) => i.id !== id) }),

  updateQty: (id, qty) =>
    set({
      cart: get().cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    }),

  toggleWishlist: (product) => {
    const wishlist = [...get().wishlist]
    const idx = wishlist.findIndex((i) => i.id === product.id)
    if (idx > -1) wishlist.splice(idx, 1)
    else wishlist.push(product)
    set({ wishlist })
  },

  isWishlisted: (id) => !!get().wishlist.find((i) => i.id === id),

  toggleSound: () => set({ soundOn: !get().soundOn }),

  cartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.qty, 0),
  cartCount: () => get().cart.reduce((sum, i) => sum + i.qty, 0),
}))

export default useStore
