import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { db, firebaseAuth } from './firebase'

// Kept for backwards compatibility with components that build image URLs as
// `${API_URL}${image}`. ImgBB always returns full https:// URLs, so that
// branch never actually gets used — this is just a safe no-op.
export const API_URL = ''

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY

// ---------- Auth ----------
// Firebase Auth's real session lives with Firebase itself; we mirror a
// simple "logged in" flag into localStorage so route guards (RequireAdmin)
// can check synchronously without waiting on an async auth-state callback.
const ADMIN_FLAG = 'zeno_admin_logged_in'

onAuthStateChanged(firebaseAuth, (user) => {
  if (user) localStorage.setItem(ADMIN_FLAG, 'true')
  else localStorage.removeItem(ADMIN_FLAG)
})

export const auth = {
  login: async (email, password) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password)
    localStorage.setItem(ADMIN_FLAG, 'true')
  },
  saveToken: () => { }, // no-op, Firebase manages the session itself
  logout: async () => {
    await signOut(firebaseAuth)
    localStorage.removeItem(ADMIN_FLAG)
  },
  isLoggedIn: () => localStorage.getItem(ADMIN_FLAG) === 'true',
}

// ---------- Helpers ----------
function withIds(snapshot) {
  return snapshot.docs.map((d) => ({ ...d.data(), _id: d.id, id: d.id }))
}

function friendlyError(err) {
  const map = {
    'auth/invalid-credential': 'Invalid email or password',
    'auth/user-not-found': 'Invalid email or password',
    'auth/wrong-password': 'Invalid email or password',
    'permission-denied': 'You need to be signed in as admin to do that',
  }
  const message = map[err.code] || err.message || 'Something went wrong'
  const wrapped = new Error(message)
  wrapped.response = { data: { error: message } }
  return wrapped
}

function slugify(name) {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function uploadImage(file) {
  if (!IMGBB_API_KEY) {
    throw new Error('Image upload isn\'t configured yet — add VITE_IMGBB_API_KEY to your .env file.')
  }
  const form = new FormData()
  form.append('image', file)

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: form,
  })
  const json = await res.json()
  if (!json.success) {
    throw new Error(json.error?.message || 'Image upload failed')
  }
  return { path: json.data.url }
}

// ---------- Products ----------
export const productsApi = {
  list: async (params = {}) => {
    try {
      const snap = await getDocs(collection(db, 'products'))
      let items = withIds(snap)
      if (params.category && params.category !== 'All') {
        items = items.filter((p) => p.category === params.category)
      }
      if (params.search) {
        const q = params.search.toLowerCase()
        items = items.filter((p) => p.name?.toLowerCase().includes(q))
      }
      return items
    } catch (err) {
      throw friendlyError(err)
    }
  },

  get: async (id) => {
    try {
      const direct = await getDoc(doc(db, 'products', id))
      if (direct.exists()) return { ...direct.data(), _id: direct.id, id: direct.id }

      // Fall back to matching by slug field for pretty URLs.
      const snap = await getDocs(query(collection(db, 'products'), where('slug', '==', id)))
      if (snap.empty) throw { code: 'not-found', message: 'Product not found' }
      const d = snap.docs[0]
      return { ...d.data(), _id: d.id, id: d.id }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  create: async (data) => {
    try {
      const payload = { ...data, slug: data.slug || slugify(data.name), createdAt: serverTimestamp() }
      const docRef = await addDoc(collection(db, 'products'), payload)
      return { ...payload, _id: docRef.id, id: docRef.id }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  update: async (id, data) => {
    try {
      await updateDoc(doc(db, 'products', id), data)
      return { ...data, _id: id, id }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  remove: async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id))
      return { success: true }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  upload: (file) => uploadImage(file),
}

// ---------- Orders ----------
function generateOrderNumber() {
  const rand = Math.floor(100000 + Math.random() * 900000)
  return `ZN-${rand}`
}

export const ordersApi = {
  create: async ({ customer, items, couponCode, paymentMethod }) => {
    try {
      if (!items || items.length === 0) throw { message: 'Cart is empty' }

      // Re-price from the live product docs — never trust prices passed in.
      let subtotal = 0
      const pricedItems = []
      for (const item of items) {
        // eslint-disable-next-line no-await-in-loop
        const snap = await getDoc(doc(db, 'products', item.productId))
        if (!snap.exists()) throw { message: `Product ${item.productId} no longer exists` }
        const product = snap.data()
        if ((product.stock ?? 0) < item.qty) throw { message: `${product.name} only has ${product.stock} left in stock` }
        subtotal += product.price * item.qty
        pricedItems.push({
          productId: item.productId,
          name: product.name,
          price: product.price,
          qty: item.qty,
          image: product.image || '',
        })
      }

      let discountAmount = 0
      if (couponCode) {
        const couponSnap = await getDoc(doc(db, 'coupons', couponCode.toUpperCase()))
        if (couponSnap.exists() && couponSnap.data().active) {
          const c = couponSnap.data()
          discountAmount = c.type === 'percent' ? Math.round(subtotal * (c.value / 100) * 100) / 100 : Math.min(c.value, subtotal)
        }
      }

      const total = Math.max(0, subtotal - discountAmount)
      const orderNumber = generateOrderNumber()

      const orderData = {
        orderNumber,
        customer: { ...customer, email: (customer.email || '').trim().toLowerCase() },
        items: pricedItems,
        couponCode: couponCode || null,
        discountAmount,
        subtotal,
        total,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        status: 'Pending',
        createdAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'orders'), orderData)

      // Decrement stock for each item (best-effort, not a strict transaction
      // across multiple products since Firestore transactions are per-doc-set
      // but this keeps it simple and safe enough for a small catalogue).
      for (const item of pricedItems) {
        // eslint-disable-next-line no-await-in-loop
        await runTransaction(db, async (tx) => {
          const ref2 = doc(db, 'products', item.productId)
          const snap = await tx.get(ref2)
          if (!snap.exists()) return
          const newStock = Math.max(0, (snap.data().stock || 0) - item.qty)
          tx.update(ref2, { stock: newStock })
        })
      }

      return { ...orderData, _id: docRef.id, id: docRef.id }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  track: async (orderNumber, email) => {
    try {
      const snap = await getDocs(
        query(collection(db, 'orders'), where('orderNumber', '==', orderNumber.trim()))
      )
      const found = snap.docs.find((d) => d.data().customer?.email === email.trim().toLowerCase())
      if (!found) throw { message: 'No order found with that number and email' }
      return { ...found.data(), _id: found.id, id: found.id }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  list: async () => {
    try {
      const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')))
      return withIds(snap)
    } catch (err) {
      throw friendlyError(err)
    }
  },

  updateStatus: async (id, status) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status })
      return { _id: id, id, status }
    } catch (err) {
      throw friendlyError(err)
    }
  },
}

// ---------- Coupons ----------
// Coupon documents are keyed by their code (uppercased) so a customer can
// look up one specific code without being able to list every coupon.
export const couponsApi = {
  validate: async (code, subtotal) => {
    try {
      const snap = await getDoc(doc(db, 'coupons', (code || '').toUpperCase()))
      if (!snap.exists()) throw { message: 'Invalid or inactive coupon code' }
      const c = snap.data()
      if (!c.active) throw { message: 'Invalid or inactive coupon code' }
      if (c.expiresAt && new Date(c.expiresAt) < new Date()) throw { message: 'This coupon has expired' }
      if (subtotal < (c.minOrder || 0)) throw { message: `This coupon requires a minimum order of $${c.minOrder}` }
      const discountAmount = c.type === 'percent' ? Math.round(subtotal * (c.value / 100) * 100) / 100 : Math.min(c.value, subtotal)
      return { code: snap.id, type: c.type, value: c.value, discountAmount }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  list: async () => {
    try {
      const snap = await getDocs(collection(db, 'coupons'))
      return snap.docs.map((d) => ({ ...d.data(), _id: d.id, id: d.id, code: d.id }))
    } catch (err) {
      throw friendlyError(err)
    }
  },

  create: async (data) => {
    try {
      const code = (data.code || '').toUpperCase()
      await setDoc(doc(db, 'coupons', code), { ...data, code })
      return { ...data, code, _id: code, id: code }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  update: async (id, data) => {
    try {
      await updateDoc(doc(db, 'coupons', id), data)
      return { ...data, _id: id, id }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  remove: async (id) => {
    try {
      await deleteDoc(doc(db, 'coupons', id))
      return { success: true }
    } catch (err) {
      throw friendlyError(err)
    }
  },
}

// ---------- Blog Posts ----------
export const postsApi = {
  list: async (all) => {
    try {
      const snap = await getDocs(collection(db, 'posts'))
      let items = withIds(snap)
      if (!all) items = items.filter((p) => p.published)
      return items
    } catch (err) {
      throw friendlyError(err)
    }
  },

  get: async (id) => {
    try {
      const direct = await getDoc(doc(db, 'posts', id))
      if (direct.exists()) return { ...direct.data(), _id: direct.id, id: direct.id }

      const snap = await getDocs(query(collection(db, 'posts'), where('slug', '==', id)))
      if (snap.empty) throw { message: 'Post not found' }
      const d = snap.docs[0]
      return { ...d.data(), _id: d.id, id: d.id }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  create: async (data) => {
    try {
      const payload = { ...data, slug: data.slug || slugify(data.title), createdAt: serverTimestamp() }
      const docRef = await addDoc(collection(db, 'posts'), payload)
      return { ...payload, _id: docRef.id, id: docRef.id }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  update: async (id, data) => {
    try {
      await updateDoc(doc(db, 'posts', id), data)
      return { ...data, _id: id, id }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  remove: async (id) => {
    try {
      await deleteDoc(doc(db, 'posts', id))
      return { success: true }
    } catch (err) {
      throw friendlyError(err)
    }
  },

  upload: (file) => uploadImage(file),
}