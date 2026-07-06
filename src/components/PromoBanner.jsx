import usePromoCycle from '../hooks/usePromoCycle'

export default function PromoBanner() {
    const { isActive, hours, minutes, seconds } = usePromoCycle()
    if (!isActive) return null

    const pad = (n) => String(n).padStart(2, '0')
    const message = `50% OFF EVERYTHING  —  LIMITED TIME ONLY  —  Ends in ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    const repeats = Array.from({ length: 4 }).fill(message)

    return (
        <div className="w-full bg-gradient-to-r from-gold via-hover-glow to-gold text-noir overflow-hidden py-1.5">
            <div className="flex whitespace-nowrap animate-marquee w-max">
                <div className="flex shrink-0">
                    {repeats.map((m, i) => (
                        <span key={`a-${i}`} className="mx-8 text-[11px] sm:text-xs font-semibold tracking-wide">
                            {m}
                        </span>
                    ))}
                </div>
                <div className="flex shrink-0" aria-hidden="true">
                    {repeats.map((m, i) => (
                        <span key={`b-${i}`} className="mx-8 text-[11px] sm:text-xs font-semibold tracking-wide">
                            {m}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}