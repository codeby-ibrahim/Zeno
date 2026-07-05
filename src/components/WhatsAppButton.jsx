import { FaWhatsapp } from 'react-icons/fa'

// Set the real business number (international format, no + or spaces).
const WHATSAPP_NUMBER = '10000000000'

export function buildWhatsAppLink(product, qty = 1) {
  const link = `${window.location.origin}/product/${product.id}`
  const message = `Hello ZENO Team,\nI want to order this perfume.\n\nProduct: ${product.name}\nPrice: $${product.price}\nQuantity: ${qty}\nLink: ${link}`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export default function WhatsAppButton({ product }) {
  const href = product
    ? buildWhatsAppLink(product)
    : `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello ZENO Team, I have a question about your fragrances.')}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Order via WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-black/40 hover:scale-110 transition-transform"
    >
      <FaWhatsapp size={26} color="#0B0B0C" />
    </a>
  )
}
