import type { ReactElement, ReactNode } from 'react'
import { Dialog, DialogTrigger, Popover as AriaPopover } from 'react-aria-components'
import styles from './Popover.module.css'

export type PopoverPlacement = 'bottom start' | 'bottom end' | 'bottom' | 'top start' | 'top end' | 'top'

export interface PopoverProps {
  /** The button that opens it: a Button or IconButton from the system. */
  trigger: ReactElement
  /** Names the panel for screen readers ("Menu"). */
  label: string
  /** The panel's content. A function receives `close`, for content that should close it (a link that opens a dialog). */
  children: ReactNode | ((close: () => void) => ReactNode)
  /** Where the panel sits against the button (default: under it, right edges aligned). */
  placement?: PopoverPlacement
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

/**
 * A panel that opens from a button and sits next to it (AcmeCo's header menu). Focus
 * moves into the panel; Escape or a click outside closes it and returns focus to the button.
 */
export function Popover({ trigger, label, children, placement = 'bottom end', isOpen, onOpenChange }: PopoverProps) {
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      {trigger}
      {/* offset 0: the gap is the --popover-offset token, set in CSS by placement. */}
      <AriaPopover className={styles.popover} placement={placement} offset={0}>
        <Dialog aria-label={label} className={styles.dialog}>
          {({ close }) => (typeof children === 'function' ? children(close) : children)}
        </Dialog>
      </AriaPopover>
    </DialogTrigger>
  )
}
