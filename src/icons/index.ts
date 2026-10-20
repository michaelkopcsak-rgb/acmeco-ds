// The icon registry: every icon the system uses, and nothing else (decision 6: Lucide).
// Components and stories import icons from here, never from lucide-react directly,
// so this list stays complete. Phase 5 generates the Figma "Icons" page from it.
//
// To add an icon: import it from lucide-react, add it to `icons` with a
// kebab-case name, and say where it's used.
import { ArrowLeft, AudioLines, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, CircleX, ExternalLink, Globe, Heart, LayoutGrid, Map as MapIcon, MapPin, Maximize2, Menu, Mic, MicOff, Minimize2, Minus, Navigation, PanelLeft, PanelTop, Phone, Search, SendHorizontal, Share, SlidersHorizontal, Sparkles, X } from 'lucide-react'

export const icons = {
  /** Checkbox checked; selected option in a Select list. */
  check: Check,
  /** Select trigger: opens the list. */
  'chevron-down': ChevronDown,
  /** Carousel: previous photo. */
  /** Back to the previous page (a listing's header on phones). */
  'arrow-left': ArrowLeft,
  'chevron-left': ChevronLeft,
  /** Carousel: next photo. */
  'chevron-right': ChevronRight,
  /** Field error, beside the message (with the error colour and a thicker border). */
  'circle-alert': CircleAlert,
  /** Clear a search field: drawn as a filled dark circle with a white cross, like AcmeCo's. */
  'circle-x': CircleX,
  /** Link that opens in a new tab. */
  'external-link': ExternalLink,
  /** A listing's location: jumps to its map (the listing page's actions, as AcmeCo's). */
  'map-pin': MapPin,
  /** Save / favourite a listing (toggle; filled when saved). */
  heart: Heart,
  /** Checkbox indeterminate (some of a group selected). */
  minus: Minus,
  /** Call a broker. */
  phone: Phone,
  /** Search submit. */
  search: Search,
  /** Share a listing. Box with an arrow, matching AcmeCo's own share icon. */
  share: Share,
  /** Close a dialog, remove a filter chip, end an assistant chat. */
  close: X,
  /** The AI assistant's mark (launcher). A reference product uses a sparkle too (decision 29). */
  sparkles: Sparkles,
  /** Assistant: Voice Mode. A waveform, as on a reference product. */
  'audio-lines': AudioLines,
  /** Assistant: microphone on. */
  mic: Mic,
  /** Assistant: microphone off. */
  'mic-off': MicOff,
  /** Assistant: send a message. */
  send: SendHorizontal,
  /** Open a panel in a larger view (assistant expand). */
  expand: Maximize2,
  /** Return a panel to its smaller view (assistant collapse). */
  collapse: Minimize2,
  /** Open the site menu (GlobalHeader); AcmeCo's header uses three lines too. */
  menu: Menu,
  /** Choose language, region and currency (GlobalHeader); AcmeCo's header uses a globe too. */
  globe: Globe,
  /** The location arrow at the start of the results search, as AcmeCo's. */
  navigation: Navigation,
  /** All Filters on the search bar; AcmeCo's uses sliders too. */
  'sliders-horizontal': SlidersHorizontal,
  /** Switch the search results to the map view ("Map"); AcmeCo's uses a folded map too. */
  map: MapIcon,
  /** Switch the search results to the gallery view ("Gallery"); AcmeCo's uses four squares too. */
  'layout-grid': LayoutGrid,
  /** Map placement: the map on the left of the results (AcmeCo's default; decision 45). */
  'panel-left': PanelLeft,
  /** Map placement: the map above the results (BENCHMARK-INFORMED proposal; decision 45). */
  'panel-top': PanelTop,
} as const

export type IconName = keyof typeof icons

export { ArrowLeft, AudioLines, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, CircleX, ExternalLink, Globe, Heart, LayoutGrid, MapIcon, MapPin, Maximize2 as Expand, Menu, Mic, MicOff, Minimize2 as Collapse, Minus, Navigation, PanelLeft, PanelTop, Phone, Search, SendHorizontal as Send, Share, SlidersHorizontal, Sparkles, X as Close }
