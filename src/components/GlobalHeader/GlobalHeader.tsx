import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, Globe } from '../../icons'
import { Button } from '../Button/Button'
import type { ChoiceCardOption } from '../ChoiceCards/ChoiceCards'
import { DialogTrigger } from '../Dialog/Dialog'
import { IconButton } from '../IconButton/IconButton'
import { Link } from '../Link/Link'
import { LocaleDialog } from '../LocaleDialog/LocaleDialog'
import { NavigationBar, type NavigationLink } from '../NavigationBar/NavigationBar'
import { SignInDialog, type SignInSlide } from '../SignInDialog/SignInDialog'
import { SiteMenu, type SiteMenuLink } from '../SiteMenu/SiteMenu'
import styles from './GlobalHeader.module.css'
import { ds } from '../ds'

export interface GlobalHeaderProps {
  /** The search links beside the logo, in order (For Lease, For Sale, Auctions, Businesses For Sale); mark the current one. */
  links: NavigationLink[]
  /** The menu's links (screens get them from src/data/site-menu.ts). */
  menu: { linksBefore: SiteMenuLink[]; searchLinks: SiteMenuLink[]; linksAfter: SiteMenuLink[] }
  /** The language-and-region and currency choices, and the current ones (the globe's dialog). */
  locales: ChoiceCardOption[]
  currencies: ChoiceCardOption[]
  locale: string
  currency: string
  onLocaleChange?: (locale: string) => void
  onCurrencyChange?: (currency: string) => void
  /** The sign-in dialog's promo slides (Sign In, and Log In/Sign Up in the menu, open it). */
  signInSlides: SignInSlide[]
  onSignInContinue?: (email: string) => void | Promise<void>
  onSignInProvider?: (provider: string) => void
  homeHref?: string
  advertiseHref?: string
  preferencesHref?: string
  /** The id of the page's main element, which the skip link jumps to (give it tabIndex={-1}). */
  mainId?: string
  /** Phones: a back arrow before the logo (a listing's way back to the results, decision 51). */
  back?: { href: string; label: string }
  /**
   * Phones: the page's own actions (a listing's save and share), shown in place of the globe and
   * menu once the element with id `after` (the page's actions row) has scrolled under the header,
   * as on AcmeCo's phone listing (decision 51). Scrolling back up brings the globe and menu back.
   */
  pageActions?: { content: ReactNode; after: string }
}

/**
 * AcmeCo's site header: the logo (a placeholder mark), the search links, then the globe,
 * Sign In, Advertise and the menu, as on the live site. A skip link comes first. On phones
 * the search links live in the menu's Search group, as on AcmeCo.
 */
export function GlobalHeader({
  links, menu, locales, currencies, locale, currency, onLocaleChange, onCurrencyChange,
  signInSlides, onSignInContinue, onSignInProvider, homeHref = '/', advertiseHref = '#advertise', preferencesHref = '#preferences', mainId = 'main',
  back, pageActions,
}: GlobalHeaderProps) {
  const ref = useRef<HTMLElement>(null)
  const [past, setPast] = useState(false)
  const after = pageActions?.after
  useEffect(() => {
    if (!after) return
    // The actions row counts as gone once it's under the header's sticky container (the header
    // and, on a listing, its title bar).
    const check = () => {
      const target = document.getElementById(after)
      const top = ref.current?.parentElement ?? ref.current
      if (!target || !top) return
      setPast(target.getBoundingClientRect().bottom <= top.getBoundingClientRect().bottom)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check) }
  }, [after])
  return (
    <header ref={ref} className={styles.header} data-page-actions={pageActions && past ? '' : undefined} {...ds({ set: 'Global header', props: { Width: 'Desktop' } })}>
      <span className={styles.skip}>
        {/* Moves focus to main as well as scrolling, so the next Tab starts there in every browser. */}
        <Link variant="standalone" href={`#${mainId}`} onPress={() => document.getElementById(mainId)?.focus()}>Skip to main content</Link>
      </span>
      <div className={styles.start}>
        {back && (
          <span className={styles.back}>
            <IconButton label={back.label} icon={<ArrowLeft />} href={back.href} />
          </span>
        )}
        <Link variant="subtle" href={homeHref}>
          <span className={styles.logo}>
            {/* A neutral placeholder: AcmeCo's logo stays out of the prototype (decision 35). */}
            <span className={styles.mark} aria-hidden="true">AC</span>
            <span className={styles.name}>AcmeCo</span>
            <span className="sr-only"> home</span>
          </span>
        </Link>
        <span className={styles.wide}>
          <NavigationBar links={links} label="Search" />
        </span>
      </div>
      <div className={styles.end}>
        {pageActions && <span className={styles.pageActions}>{pageActions.content}</span>}
        <span className={styles.globe}>
          <DialogTrigger>
            <IconButton label="Language and region" icon={<Globe />} />
            <LocaleDialog
              locales={locales}
              currencies={currencies}
              locale={locale}
              currency={currency}
              onLocaleChange={onLocaleChange}
              onCurrencyChange={onCurrencyChange}
              preferencesHref={preferencesHref}
            />
          </DialogTrigger>
        </span>
        {/* On phones these two are in the menu (Log In/Sign Up, Advertise), as on AcmeCo's phones. */}
        <span className={styles.wideAction}>
          <DialogTrigger>
            <Button variant="tertiary">Sign In</Button>
            <SignInDialog slides={signInSlides} onContinue={onSignInContinue} onProvider={onSignInProvider} />
          </DialogTrigger>
        </span>
        <span className={styles.wideAction}>
          <Link variant="subtle" href={advertiseHref}>Advertise</Link>
        </span>
        <span className={styles.menu}>
        <SiteMenu
          linksBefore={menu.linksBefore}
          searchLinks={menu.searchLinks}
          linksAfter={menu.linksAfter}
          signInSlides={signInSlides}
          onSignInContinue={onSignInContinue}
          onSignInProvider={onSignInProvider}
        />
        </span>
      </div>
    </header>
  )
}
