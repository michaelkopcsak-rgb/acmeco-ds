import type { ReactNode } from 'react'
import { Dialog as AriaDialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { Close } from '../../icons'
import { useScrollableFocus } from '../../hooks/useScrollableFocus'
import { IconButton } from '../IconButton/IconButton'
import styles from './Dialog.module.css'

export { DialogTrigger }

export type DialogSize = 'md' | 'lg'

export interface DialogProps {
  /** Required: shown as the heading and names the dialog for screen readers. */
  title: string
  /** The body. A function receives `close`, for content that finishes the task itself (choosing a language). */
  children: ReactNode | ((close: () => void) => ReactNode)
  /** Actions, in a footer that stays put while the body scrolls. A function receives `close`. */
  footer?: ReactNode | ((close: () => void) => ReactNode)
  /** `md` 500px (single-column forms), `lg` 768px (two columns, filters). Full screen at 768px and below. */
  size?: DialogSize
  /**
   * Clicking the backdrop closes the dialog (default). Turn it off for dialogs holding a form,
   * so a stray click doesn't lose what someone typed. Escape and Close always work (decision 28).
   */
  isDismissable?: boolean
  /** Controlled open state. Leave both unset when the dialog sits inside a DialogTrigger. */
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

/**
 * A modal dialog: blocks the page until closed. Focus moves in, stays inside, and
 * returns to what opened it; Escape closes. Put it inside a `DialogTrigger` with the
 * button that opens it, or control it with `isOpen` / `onOpenChange`.
 */
export function Dialog({ title, children, footer, size = 'md', isDismissable = true, isOpen, onOpenChange }: DialogProps) {
  return (
    <ModalOverlay className={styles.overlay} isDismissable={isDismissable} isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal className={`${styles.modal} ${styles[size]}`}>
        <AriaDialog className={styles.dialog}>
          {({ close }) => (
            <>
              <div className={styles.header}>
                {/* slot="title" makes this heading the dialog's accessible name. */}
                <Heading slot="title" className={styles.title}>{title}</Heading>
                <IconButton label="Close" icon={<Close />} size="sm" onPress={close} />
              </div>
              <DialogBody label={title}>{typeof children === 'function' ? children(close) : children}</DialogBody>
              {footer && <div className={styles.footer}>{typeof footer === 'function' ? footer(close) : footer}</div>}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  )
}

/**
 * The scrolling body. When its content overflows it becomes focusable, so keyboard
 * users can scroll it with the arrow keys even when it holds only text.
 */
function DialogBody({ label, children }: { label: string; children: ReactNode }) {
  const { ref, scrolls } = useScrollableFocus<HTMLDivElement>([children])
  return (
    <div
      ref={ref}
      className={styles.body}
      {...(scrolls ? { tabIndex: 0, role: 'region', 'aria-label': `${label}, content` } : {})}
    >
      {children}
    </div>
  )
}
