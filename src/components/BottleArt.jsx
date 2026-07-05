// A single hand-drawn bottle silhouette reused everywhere, recolored per
// fragrance via CSS variables. This is the site's signature visual motif —
// no external photography or 3D asset dependency required.
export default function BottleArt({ liquidColor = '#D4AF37', className = '', glow = true }) {
  const uid = liquidColor.replace('#', '')
  return (
    <svg
      viewBox="0 0 220 420"
      className={className}
      role="img"
      aria-label="Perfume bottle illustration"
    >
      <defs>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a3a3a" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#0B0B0C" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`liquid-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.75" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow && <ellipse cx="110" cy="230" rx="95" ry="150" fill={`url(#glow-${uid})`} />}

      {/* cap */}
      <rect x="85" y="10" width="50" height="46" rx="6" fill="#D4AF37" />
      <rect x="85" y="10" width="50" height="10" rx="4" fill="#F2D27A" />
      {/* neck */}
      <rect x="98" y="52" width="24" height="26" fill="#1c1c1c" stroke="#D4AF37" strokeWidth="1" />
      {/* body */}
      <path
        d="M70 78 H150 C160 78 168 88 168 100 V330 C168 360 145 388 110 388 C75 388 52 360 52 330 V100 C52 88 60 78 70 78 Z"
        fill={`url(#glass-${uid})`}
        stroke="#D4AF37"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* liquid fill */}
      <path
        d="M58 180 H162 V330 C162 357 139 380 110 380 C81 380 58 357 58 330 Z"
        fill={`url(#liquid-${uid})`}
      />
      {/* label */}
      <rect x="75" y="220" width="70" height="48" rx="2" fill="#0B0B0C" fillOpacity="0.55" stroke="#D4AF37" strokeWidth="0.75" />
      <text x="110" y="240" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fill="#F2D27A" letterSpacing="2">ZENO</text>
      <line x1="88" y1="248" x2="132" y2="248" stroke="#D4AF37" strokeWidth="0.5" />
      <text x="110" y="260" textAnchor="middle" fontFamily="Jost, sans-serif" fontSize="6" fill="#B3B3B3" letterSpacing="1.5">PARFUM</text>
      {/* highlight */}
      <path d="M64 100 C64 90 70 84 78 84" stroke="#F8F8F8" strokeOpacity="0.35" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
