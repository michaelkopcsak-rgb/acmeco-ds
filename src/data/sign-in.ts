// The sign-in dialog's promo slides, for stories and screens (components take them as props).
import type { SignInSlide } from '../components/SignInDialog/SignInDialog'
import { buildingIllustration } from './illustrations'

// AcmeCo's four slides: titles 1 and 4 and their text are AcmeCo's (audit capture,
// a reference screenshot); 2 and 3 weren't recorded and are placeholders. Pictures are placeholders.
export const signInSlides: SignInSlide[] = [
  { title: 'Never miss a deal', text: 'Receive new listings that match your saved searches.', image: buildingIllustration(3) },
  { title: 'Save your searches', text: 'Come back to the places and property types you follow (placeholder).', image: buildingIllustration(11) },
  { title: 'Track properties', text: 'Keep the listings you like in one place (placeholder).', image: buildingIllustration(19) },
  { title: 'Access secure data', text: 'View confidential documents and streamline your due diligence.', image: buildingIllustration(27) },
]
