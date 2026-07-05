import { motion } from 'framer-motion'

export default function PageWrap({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
