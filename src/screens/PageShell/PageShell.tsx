// The page shell: the worked example in docs/BUILDING-SCREENS.md and the 6b pilot
// (decision 37). Every screen starts from it: GlobalHeader, a main landmark the skip link
// can reach, the page's one h1 inside the layout primitives, and the Footer (whose
// copyright line carries the prototype label). Built only from the system; its gap log is
// docs/screens/page-shell-gaps.md (its four gaps closed by Heading, Text and Main).
import { useState } from 'react'
import { Footer } from '../../components/Footer/Footer'
import { GlobalHeader } from '../../components/GlobalHeader/GlobalHeader'
import { Heading } from '../../components/Heading/Heading'
import { Main, PageContainer, Section, Stack } from '../../components/Layout/Layout'
import { Text } from '../../components/Text/Text'
import { footerApps, footerColumns, footerPhoneLinks, footerSocial } from '../../data/footer'
import { currencies, locales } from '../../data/locales'
import { searchLinks } from '../../data/navigation'
import { signInSlides } from '../../data/sign-in'
import { menuLinksAfter, menuLinksBefore, menuSearchLinks } from '../../data/site-menu'

export interface PageShellProps {
  /** The page's one h1. */
  title?: string
  /** Which search link is the current page, if any ("For Lease"). */
  current?: string
}

export function PageShell({ title = 'Page title', current }: PageShellProps) {
  // The page holds the language and currency, as a real page would.
  const [locale, setLocale] = useState('en-US')
  const [currency, setCurrency] = useState('USD')
  return (
    <>
      <GlobalHeader
        links={searchLinks.map((l) => ({ ...l, isCurrent: l.label === current }))}
        menu={{ linksBefore: menuLinksBefore, searchLinks: menuSearchLinks, linksAfter: menuLinksAfter }}
        locales={locales}
        currencies={currencies}
        locale={locale}
        currency={currency}
        onLocaleChange={setLocale}
        onCurrencyChange={setCurrency}
        signInSlides={signInSlides}
      />
      <Main>
        <PageContainer>
          <Stack gap="section">
            <Section labelledBy="page-title">
              <Heading level={1} id="page-title">{title}</Heading>
              <Text>Replace this with the screen's sections, each a Section named by its heading.</Text>
            </Section>
          </Stack>
        </PageContainer>
      </Main>
      <Footer columns={footerColumns} social={footerSocial} apps={footerApps} phoneLinks={footerPhoneLinks} />
    </>
  )
}
