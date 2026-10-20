// AcmeCo's language-and-region and currency choices (the globe's dialog, live site,
// 2026-10-10), for stories and screens (components take them as props).
import type { ChoiceCardOption } from '../components/ChoiceCards/ChoiceCards'

export const locales: ChoiceCardOption[] = [
  { value: 'en-US', label: 'English', description: 'United States' },
  { value: 'en-CA', label: 'English', description: 'Canada' },
  { value: 'en-GB', label: 'English', description: 'United Kingdom' },
  { value: 'es-ES', label: 'Español', description: 'España' },
  { value: 'fr-CA', label: 'Français', description: 'Canada' },
  { value: 'fr-FR', label: 'Français', description: 'France' },
]

export const currencies: ChoiceCardOption[] = [
  { value: 'USD', label: 'US Dollar', description: 'USD $' },
  { value: 'AUD', label: 'Australian Dollar', description: 'AUD $' },
  { value: 'CAD', label: 'Canadian Dollar', description: 'CAD $' },
  { value: 'EUR', label: 'Euro', description: 'EUR €' },
  { value: 'GBP', label: 'Pound Sterling', description: 'GBP £' },
]
