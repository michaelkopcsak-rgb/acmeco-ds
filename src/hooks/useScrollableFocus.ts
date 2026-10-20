import { useEffect, useRef, useState, type DependencyList } from 'react'

/**
 * For an area that may scroll (a dialog body, a conversation): reports whether its
 * content overflows, so the area can take keyboard focus only then. Keyboard users
 * can then scroll text-only content with the arrow keys, and short content adds no
 * extra Tab stop (axe rule scrollable-region-focusable).
 */
export function useScrollableFocus<T extends HTMLElement>(deps: DependencyList) {
  const ref = useRef<T>(null)
  const [scrolls, setScrolls] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setScrolls(el.scrollHeight > el.clientHeight)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    for (const child of Array.from(el.children)) observer.observe(child)
    return () => observer.disconnect()
    // The caller passes what changes the content (children, messages).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { ref, scrolls }
}
