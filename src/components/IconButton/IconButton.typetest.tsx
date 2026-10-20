// Type-level tests, checked by `npm run typecheck` (never rendered).
// Each line below must fail to compile. If a rule ever loosened (say `label`
// became optional), its @ts-expect-error would go unused and the type check
// would fail, so the rule can't be dropped by accident.
import { Heart } from '../../icons'
import { IconButton } from './IconButton'

// @ts-expect-error `label` is required: an icon-only button must have an accessible name.
export const missingLabel = <IconButton icon={<Heart />} />

// @ts-expect-error A toggle can't also be a link.
export const toggleThatLinks = <IconButton label="Save listing" icon={<Heart />} isSelected onChange={() => {}} href="#" />

// @ts-expect-error A toggle reports changes with onChange, not onPress.
export const toggleWithOnPress = <IconButton label="Save listing" icon={<Heart />} isSelected onChange={() => {}} onPress={() => {}} />
