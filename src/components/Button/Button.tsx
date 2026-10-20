import type { ReactNode } from 'react'
import { Button as AriaButton, Link as AriaLink, type PressEvent } from 'react-aria-components'
import styles from './Button.module.css'
import { ds, iconName, plain } from '../ds'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface CommonProps {
  /** The visible label. Also the button's accessible name. */
  children: ReactNode
  /** primary: the main action (dark blue fill). secondary: an alternative (dark blue outline). tertiary: a quiet action (no fill). */
  variant?: ButtonVariant
  /** sm 32px, md 40px, lg 48px tall. */
  size?: ButtonSize
  /** An icon before the label (a Lucide icon). Hidden from screen readers: the label names the button. */
  startIcon?: ReactNode
  /** Stretch to the width of its container. */
  fullWidth?: boolean
  /** The action isn't available. It can't be pressed or focused; explain why nearby. */
  isDisabled?: boolean
  /** Runs on mouse, touch and keyboard (Enter, Space) alike. */
  onPress?: (event: PressEvent) => void
}

interface AsButtonProps extends CommonProps {
  href?: undefined
  /** Use 'submit' inside a form. */
  type?: 'button' | 'submit' | 'reset'
  /** The action is running: shows a spinner, ignores presses, keeps focus and tells screen readers it's busy. */
  isLoading?: boolean
}

interface AsLinkProps extends CommonProps {
  /** Navigates instead of acting, so it renders a real link styled as a button. */
  href: string
  /** e.g. '_blank'. */
  target?: string
  rel?: string
}

export type ButtonProps = AsButtonProps | AsLinkProps

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', startIcon, fullWidth, isDisabled, onPress } = props
  const className = [styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth].filter(Boolean).join(' ')
  const mark = ds({
    set: 'Button',
    props: { Variant: variant, Size: size, State: isDisabled ? 'Disabled' : 'Default' },
    ...(plain(children) ? { text: { Label: plain(children)! } } : {}),
    bools: { 'Show icon': !!startIcon },
    ...(iconName(startIcon) ? { icons: { Icon: iconName(startIcon)! } } : {}),
  })
  const content = (
    <>
      {startIcon && (
        <span className={styles.icon} aria-hidden="true">
          {startIcon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
    </>
  )

  if (props.href !== undefined) {
    return (
      <AriaLink className={className} href={props.href} target={props.target} rel={props.rel} isDisabled={isDisabled} onPress={onPress} {...mark}>
        {content}
      </AriaLink>
    )
  }

  return (
    <AriaButton
      className={className}
      {...mark}
      type={props.type ?? 'button'}
      isDisabled={isDisabled}
      // React Aria's pending state: presses are ignored but the button keeps focus
      // and screen readers hear that it's busy. Never the disabled attribute,
      // which would drop keyboard focus mid-action (decision 18).
      isPending={props.isLoading}
      onPress={onPress}
    >
      {content}
      {props.isLoading && <span className={styles.spinner} aria-hidden="true" />}
    </AriaButton>
  )
}
