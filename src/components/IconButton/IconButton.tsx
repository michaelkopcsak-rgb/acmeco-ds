import type { ReactNode } from 'react'
import { Button as AriaButton, Link as AriaLink, ToggleButton as AriaToggleButton, type PressEvent } from 'react-aria-components'
import styles from './IconButton.module.css'

export type IconButtonVariant = 'plain' | 'overlay' | 'primary'
export type IconButtonSize = 'sm' | 'md' | 'lg'

interface CommonProps {
  /**
   * What the button does, read by screen readers ("Save listing", "Next photo").
   * Required: the audit found 481 of 533 icon-only buttons had no accessible name.
   */
  label: string
  /** An icon from the registry (src/icons). Hidden from screen readers; `label` names the button. */
  icon: ReactNode
  /** plain: no container (toolbars, cards). overlay: translucent circle over photos. primary: dark blue fill (search submit). */
  variant?: IconButtonVariant
  /** sm 32px, md 40px, lg 48px square. */
  size?: IconButtonSize
  /** 'circle' rounds the primary variant (plain and overlay are always circles), e.g. a submit inside a pill-shaped search field. */
  shape?: 'default' | 'circle'
  /** Can't be pressed or focused; explain why nearby. */
  isDisabled?: boolean
}

interface AsButtonProps extends CommonProps {
  /** Runs on mouse, touch and keyboard (Enter, Space) alike. */
  onPress?: (event: PressEvent) => void
  type?: 'button' | 'submit'
  href?: undefined
  isSelected?: undefined
  onChange?: undefined
}

interface AsToggleProps extends CommonProps {
  /** Makes it a toggle (e.g. save): announced as pressed or not pressed. */
  isSelected: boolean
  onChange: (isSelected: boolean) => void
  onPress?: undefined
  href?: undefined
}

interface AsLinkProps extends CommonProps {
  /** Navigates instead of acting, so it renders a real link. */
  href: string
  target?: string
  rel?: string
  onPress?: (event: PressEvent) => void
  isSelected?: undefined
  onChange?: undefined
}

export type IconButtonProps = AsButtonProps | AsToggleProps | AsLinkProps

export function IconButton(props: IconButtonProps) {
  const { label, icon, variant = 'plain', size = 'md', shape = 'default', isDisabled } = props
  const className = [styles.iconButton, styles[variant], styles[size], shape === 'circle' && styles.circle].filter(Boolean).join(' ')
  const content = (
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
  )

  if (props.href !== undefined) {
    return (
      <AriaLink aria-label={label} className={className} href={props.href} target={props.target} rel={props.rel} isDisabled={isDisabled} onPress={props.onPress}>
        {content}
      </AriaLink>
    )
  }
  if (props.isSelected !== undefined) {
    return (
      <AriaToggleButton aria-label={label} className={className} isSelected={props.isSelected} onChange={props.onChange} isDisabled={isDisabled}>
        {content}
      </AriaToggleButton>
    )
  }
  return (
    <AriaButton aria-label={label} className={className} type={props.type ?? 'button'} isDisabled={isDisabled} onPress={props.onPress}>
      {content}
    </AriaButton>
  )
}
