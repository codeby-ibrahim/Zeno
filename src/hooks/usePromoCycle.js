import { useEffect, useMemo, useState } from 'react'

// Runs a repeating cycle: 24 hours "on" (offer visible with a live
// countdown), then 2 hours "off" (banner hidden), then it starts again —
// forever, the same for every visitor since it's based on a fixed clock
// time rather than when each person happens to load the page.
export default function usePromoCycle() {
    const CYCLE_ON = 24 * 60 * 60 * 1000
    const CYCLE_OFF = 2 * 60 * 60 * 1000
    const CYCLE_TOTAL = CYCLE_ON + CYCLE_OFF
    const EPOCH = useMemo(() => new Date('2026-01-01T00:00:00Z').getTime(), [])

    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(id)
    }, [])

    const elapsed = ((now - EPOCH) % CYCLE_TOTAL + CYCLE_TOTAL) % CYCLE_TOTAL
    const isActive = elapsed < CYCLE_ON
    const msLeft = isActive ? CYCLE_ON - elapsed : CYCLE_TOTAL - elapsed

    return {
        isActive,
        hours: Math.floor(msLeft / (1000 * 60 * 60)),
        minutes: Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((msLeft % (1000 * 60)) / 1000),
    }
}