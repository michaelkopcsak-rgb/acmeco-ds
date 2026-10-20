// Story-only helper: shows a React Aria component in a hover, pressed or
// focus state without anyone hovering, pressing or tabbing.
//
// React Aria signals states with data attributes (data-hovered, data-pressed,
// data-focus-visible) instead of CSS :hover / :active, which keeps them
// touch-safe. The pseudo-states addon only forces CSS pseudo-classes, and React
// Aria strips data-* props it manages, so neither can show these states.
// Instead, this sets the attributes on the rendered element after React Aria has
// rendered. React only updates attributes it set itself, so the forced ones
// stay. The component's own code is untouched.
import { useLayoutEffect, useRef, type ReactNode } from 'react'

export type ForcedState = 'default' | 'hover' | 'pressed' | 'focus' | 'focus-within'

const ATTRIBUTES: Record<ForcedState, string[]> = {
  default: [],
  hover: ['data-hovered'],
  pressed: ['data-hovered', 'data-pressed'],
  focus: ['data-focus-visible', 'data-focused'],
  // For groups such as a field's control box (React Aria's Group).
  'focus-within': ['data-focus-within', 'data-focus-visible'],
}

export function ForceState({ state, target, children }: {
  state: ForcedState
  /** CSS selector for the element to force, inside the child (default: the child itself). */
  target?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLSpanElement>(null)
  // No dependency list on purpose: re-apply after every render. Some components
  // (React Aria collections such as TagGroup) render their items in a second
  // pass, after this effect, so a MutationObserver re-applies the state when
  // elements appear. It watches child changes only, so setting attributes here
  // can't trigger it again.
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const apply = () => {
      const element = target ? root.querySelector(target) : root.firstElementChild
      for (const name of ATTRIBUTES[state]) element?.setAttribute(name, 'true')
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  })
  return (
    <span ref={ref} style={{ display: 'contents' }}>
      {children}
    </span>
  )
}
