import type { ReactNode } from 'react'
import { ToggleButton, ToggleButtonGroup as AriaToggleButtonGroup, Tooltip, TooltipTrigger, type Key } from 'react-aria-components'
import styles from './ToggleButtonGroup.module.css'
import { ds } from '../ds'

export interface ToggleButtonOption {
  id: string
  /** What the button chooses ("Map on the left"): its accessible name and its tooltip. */
  label: string
  /** The icon drawn on the button, from the icon registry. */
  icon: ReactNode
}

export interface ToggleButtonGroupProps {
  /** What's being chosen ("Map placement"): the group's accessible name. */
  label: string
  options: ToggleButtonOption[]
  /** The chosen option's id; one is always chosen. */
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

/**
 * A few icon buttons where exactly one is chosen: a view or layout setting that applies at
 * once (the search results' map placement, decision 45). Each button is named by its label,
 * shown as a tooltip on hover and keyboard focus. React Aria exposes it as a radio group:
 * one Tab stop, arrow keys move between the buttons, Space chooses, the chosen one
 * announced as checked.
 */
export function ToggleButtonGroup({ label, options, value, defaultValue, onChange }: ToggleButtonGroupProps) {
  const toKeys = (v?: string) => (v === undefined ? undefined : new Set<Key>([v]))
  return (
    <AriaToggleButtonGroup
      className={styles.group}
      {...ds({ set: 'Toggle button group', props: { Chosen: (value ?? defaultValue) === options[1]?.id ? 'Second' : 'First', State: 'Default' } })}
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={toKeys(value)}
      defaultSelectedKeys={toKeys(defaultValue)}
      onSelectionChange={(keys) => { const [k] = keys; if (k !== undefined) onChange?.(String(k)) }}
    >
      {options.map((o) => (
        <TooltipTrigger key={o.id} delay={300}>
          <ToggleButton id={o.id} aria-label={o.label} className={styles.button}>
            <span className={styles.icon} aria-hidden="true">{o.icon}</span>
          </ToggleButton>
          <Tooltip className={styles.tooltip} placement="bottom">{o.label}</Tooltip>
        </TooltipTrigger>
      ))}
    </AriaToggleButtonGroup>
  )
}
