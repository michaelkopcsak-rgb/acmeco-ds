import type { ReactNode } from 'react'
import { Tab, TabList, TabPanel, Tabs as AriaTabs } from 'react-aria-components'
import styles from './Tabs.module.css'

export interface TabItem {
  id: string
  /** The tab's label: short, in the words of what the panel shows ("Currency"). */
  label: string
  /** The panel shown when this tab is selected. */
  content: ReactNode
  isDisabled?: boolean
}

export interface TabsProps {
  /** Names the set of tabs for screen readers ("Language and currency"). */
  label: string
  /** Two to five tabs, each with its panel. */
  items: TabItem[]
  /** Controlled selection (the selected tab's id). */
  selectedId?: string
  defaultSelectedId?: string
  onSelectionChange?: (id: string) => void
}

/**
 * Switches between panels of related content in place (AcmeCo's Language and Region /
 * Currency). Built on React Aria Tabs: one tab stop, arrow keys move between tabs, and
 * each panel is named by its tab.
 */
export function Tabs({ label, items, selectedId, defaultSelectedId, onSelectionChange }: TabsProps) {
  return (
    <AriaTabs
      className={styles.tabs}
      selectedKey={selectedId}
      defaultSelectedKey={defaultSelectedId}
      onSelectionChange={(key) => onSelectionChange?.(String(key))}
    >
      <TabList aria-label={label} className={styles.list}>
        {items.map((item) => (
          <Tab key={item.id} id={item.id} className={styles.tab} isDisabled={item.isDisabled}>
            {item.label}
          </Tab>
        ))}
      </TabList>
      {items.map((item) => (
        <TabPanel key={item.id} id={item.id} className={styles.panel}>
          {item.content}
        </TabPanel>
      ))}
    </AriaTabs>
  )
}
