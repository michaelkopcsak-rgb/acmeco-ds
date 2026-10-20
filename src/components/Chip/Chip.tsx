import { Button, Label, Tag, TagGroup, TagList, type Key } from 'react-aria-components'
import { Close } from '../../icons'
import styles from './Chip.module.css'
import { ds } from '../ds'

export interface ChipItem {
  id: string
  label: string
}

export interface ChipGroupProps {
  /** Always required: what the chips are ("Selected states"); the list's accessible name. */
  label: string
  /** Show the label above the chips. Usually hidden: the field or heading around them explains them. */
  showLabel?: boolean
  items: ChipItem[]
  /** Called with the ids removed (by the x button, or Delete / Backspace on a focused chip). Omit to make chips not removable. */
  onRemove?: (ids: string[]) => void
}

/**
 * Removable selected values, such as chosen states or active filters.
 * Built on React Aria's TagGroup: a labelled list; arrow keys move between chips;
 * Delete or Backspace removes the focused chip; each x is labelled "Remove {chip}".
 */
export function ChipGroup({ label, showLabel = false, items, onRemove }: ChipGroupProps) {
  return (
    <TagGroup
      className={styles.group}
      onRemove={onRemove ? (keys: Set<Key>) => onRemove([...keys].map(String)) : undefined}
      {...(showLabel ? {} : { 'aria-label': label })}
    >
      {showLabel && <Label className={styles.label}>{label}</Label>}
      <TagList className={styles.list} items={items}>
        {(item) => (
          <Tag id={item.id} textValue={item.label} className={styles.chip} {...ds({ set: 'Chip', props: { Removable: onRemove ? 'Yes' : 'No', State: 'Default' }, text: { Label: item.label } })}>
            {({ allowsRemoving }) => (
              <>
                <span>{item.label}</span>
                {allowsRemoving && (
                  // React Aria names this button with its own label plus the chip's
                  // text, so "Remove" is announced as "Remove Colorado".
                  <Button slot="remove" className={styles.remove} aria-label="Remove">
                    <Close className={styles.removeIcon} aria-hidden="true" />
                  </Button>
                )}
              </>
            )}
          </Tag>
        )}
      </TagList>
    </TagGroup>
  )
}
