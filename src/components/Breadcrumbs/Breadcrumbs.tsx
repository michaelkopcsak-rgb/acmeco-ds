import { Breadcrumb, Breadcrumbs as AriaBreadcrumbs } from 'react-aria-components'
import { ds } from '../ds'
import { Link } from '../Link/Link'
import styles from './Breadcrumbs.module.css'

export interface BreadcrumbItem {
  /** What the page is called ("Colorado", "Office Spaces"). */
  label: string
  /** Where it is. Leave it off the last item: that's the current page. */
  href?: string
}

export interface BreadcrumbsProps {
  /** The trail, from the widest page to the current one (last, with no href). */
  items: BreadcrumbItem[]
  /** strip: AcmeCo's light grey strip with a line above and below (a listing, the end of the results). plain: the trail alone. */
  appearance?: 'strip' | 'plain'
  /** The navigation's name (default "Breadcrumb"). */
  label?: string
}

/**
 * Where the page sits: a named navigation with an ordered list of links, the current page
 * last, not a link and announced as the current page. Slashes separate the links, as on
 * AcmeCo, and screen readers skip them. Long trails wrap (AcmeCo's phone wraps the current
 * page onto its own line).
 */
export function Breadcrumbs({ items, appearance = 'strip', label = 'Breadcrumb' }: BreadcrumbsProps) {
  const last = items.length - 1
  const mark = ds({
    set: 'Breadcrumbs',
    props: { Appearance: appearance === 'strip' ? 'Strip' : 'Plain', Length: items.length <= 2 ? 'Two' : 'Four' },
    layers: Object.fromEntries(items.map((item, i) => [i === last ? 'Current' : `Crumb ${i + 1}`, item.label])),
  })
  return (
    <nav aria-label={label} className={styles.breadcrumbs} data-appearance={appearance} {...mark}>
      <AriaBreadcrumbs className={styles.list}>
        {items.map((item, i) => (
          <Breadcrumb key={`${i}-${item.label}`} id={String(i)} className={styles.item}>
            {i < last && item.href
              ? <Link variant="standalone" href={item.href}>{item.label}</Link>
              : <span className={styles.current} aria-current="page">{item.label}</span>}
          </Breadcrumb>
        ))}
      </AriaBreadcrumbs>
    </nav>
  )
}
