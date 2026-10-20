// The AI Assistant's Figma spec. Mirrors src/components/Assistant/Assistant.module.css
// (tree format: see button.mjs). One set, one variant per view, as stills (decision 33):
// the connecting edge and thinking dots move in code. Gradients are bound stop by stop to
// the accent variables; the text box, Send and the small buttons are instances.

const VIEWS = ['Launcher md', 'Launcher lg', 'Connecting', 'Panel', 'Panel thinking', 'Panel voice', 'Expanded']
const NAME = 'AcmeCo AI'
// The accent edge (launcher and panel), the moving edge (connecting, shown at its start) and the header line.
const ACCENT = { gradient: ['assistant/accent/start', 'assistant/accent/end'], angle: 109 }
const EDGE = { gradient: ['assistant/accent/start', 'assistant/edge/light', 'assistant/accent/end'], angle: 109 }
const MOVING = { gradient: ['assistant/accent/end', 'assistant/edge/light', 'assistant/accent/start', 'assistant/edge/light', 'assistant/accent/end'], angle: 90 }
const LINE = { gradient: ['assistant/accent/start', 'assistant/edge/light', 'assistant/accent/end'], angle: 90 }
const MESSAGES = [
  ['reply', 'Hi, how can I help? Ask me about a listing, a neighbourhood or what to search for.'],
  ['user', 'Is there parking?'],
  ['reply', 'Larkspur Commons includes covered parking at no extra monthly cost (placeholder answer).'],
]
const msg = { fontSize: 'assistant/message/font-size', lineHeight: 'assistant/message/line-height', fill: 'assistant/message/color' }
const nameText = (name) => ({ k: 'text', name, chars: NAME, fontSize: 'assistant/message/font-size', lineHeight: 'assistant/message/line-height', fontWeight: 'assistant/launcher/font-weight', fill: 'assistant/launcher/text' })
const sparkles = { k: 'icon', name: 'Sparkles', icon: 'sparkles', size: 'assistant/launcher/icon-size', color: 'assistant/accent/end' }
const dots = { k: 'frame', name: 'Dots', dir: 'H', gap: 'assistant/dots/gap', children: [1, 2, 3].map((i) => ({ k: 'frame', name: `Dot ${i}`, dir: 'H', size: 'assistant/dots/size', radius: 'assistant/launcher/radius', fill: 'assistant/dots/color', children: [] })) }

// Voice Mode and End chat: 32px outlined controls, 4px corners; Voice Mode on is filled with the accent.
function control(name, label, icon, on = false) {
  return {
    k: 'frame', name, dir: 'H', gap: 'assistant/toggle/gap', height: 'assistant/toggle/height', padX: 'assistant/toggle/padding-x', radius: 'assistant/toggle/radius',
    fill: on ? ACCENT : 'assistant/panel/background', stroke: on ? 'transparent' : 'assistant/toggle/border', strokeWidth: 'assistant/toggle/border-width',
    children: [
      { k: 'text', name: `${name} label`, chars: label, fontSize: 'assistant/toggle/font-size', lineHeight: 'assistant/toggle/line-height', fontWeight: 'assistant/launcher/font-weight', fill: on ? 'assistant/accent/text' : 'assistant/toggle/text' },
      { k: 'icon', name: `${name} icon`, icon, size: 'assistant/toggle/icon-size', color: on ? 'assistant/accent/text' : 'assistant/toggle/text' },
    ],
  }
}
const small = (name, icon) => ({ k: 'instance', name, set: 'Icon button', props: { Variant: 'plain', Size: 'sm', State: 'Default' }, icons: { Icon: icon } })

function log(thinking, expanded) {
  return {
    k: 'frame', name: 'Log', dir: 'V', align: 'start', cross: 'start', gap: 'assistant/message/gap', stretch: true, ...(expanded ? { fillHeight: true } : {}),
    children: [
      ...MESSAGES.map(([from, text], i) => (from === 'user'
        // The user's message sits on the right in a grey bubble (at most 75% wide).
        ? { k: 'frame', name: 'User row', dir: 'H', align: 'end', stretch: true, children: [{ k: 'frame', name: 'User message', dir: 'H', padX: 'assistant/message/user-padding-x', padY: 'assistant/message/user-padding-y', radius: 'assistant/message/user-radius', fill: 'assistant/message/user-background', children: [{ k: 'text', name: 'User text', chars: text, ...msg }] }] }
        : { k: 'text', name: `Reply ${i + 1}`, chars: text, ...msg, stretch: true })),
      ...(thinking ? [dots] : []),
    ],
  }
}
function composer(voice, expanded) {
  return {
    k: 'frame', name: 'Composer', dir: 'H', align: 'start', cross: 'end', gap: 'assistant/toggle/gap', stretch: true,
    // Expanded: under a line, reaching the panel's sides.
    ...(expanded ? { padTop: 'assistant/panel/padding', padX: 'assistant/panel/padding', stroke: 'assistant/panel/divider', strokeWidth: 'assistant/toggle/border-width', strokeSides: { top: 'assistant/toggle/border-width' } } : {}),
    children: [
      {
        k: 'instance', name: 'Message field', set: 'Text field', props: { Size: 'md', State: 'Default' }, stretch: true,
        // The label is there for screen readers only (hideLabel).
        overrides: [{ layer: 'Label', visible: false }, { layer: 'Value', chars: voice ? 'I\'m listening. Say or type something…' : 'Ask me something…' }],
      },
      { k: 'instance', name: 'Send', set: 'Icon button', props: { Variant: 'primary', Size: 'md', State: 'Default' }, icons: { Icon: 'send' } },
    ],
  }
}
function controls(voice, expanded) {
  return {
    k: 'frame', name: 'Controls', dir: 'H', align: 'start', cross: 'center', gap: 'assistant/panel/gap', stretch: true, ...(expanded ? { padX: 'assistant/panel/padding' } : {}),
    children: [
      control('Voice Mode', 'Voice Mode', 'audio-lines', voice),
      ...(voice ? [small('Microphone', 'mic')] : []),
      // Pushes End chat to the end. 1px tall: an empty Figma frame would otherwise keep a 100px default.
      { k: 'frame', name: 'Spacer', dir: 'H', height: 1, stretch: true, children: [] },
      control('End chat', 'End chat', 'close'),
    ],
  }
}
const panelFrame = { dir: 'V', width: 'assistant/bar/width', align: 'start', cross: 'start', gap: 'assistant/panel/gap', radius: 'assistant/panel/radius', fill: 'assistant/panel/background', stroke: EDGE, strokeWidth: 'assistant/edge/width', effect: ['shadow/raised', 'shadow/glow'] }

function tree(view) {
  if (view.startsWith('Launcher')) {
    const size = view.endsWith('lg') ? 'lg' : 'md'
    return {
      k: 'frame', dir: 'H', gap: 'assistant/launcher/gap', height: `assistant/launcher/height-${size}`, padLeft: 'assistant/launcher/padding-start', padRight: 'assistant/launcher/padding-end',
      radius: 'assistant/launcher/radius', fill: 'assistant/launcher/background', stroke: ACCENT, strokeWidth: 'assistant/edge/width', children: [nameText('Name'), sparkles],
    }
  }
  if (view === 'Connecting') {
    return {
      k: 'frame', dir: 'H', align: 'between', width: 'assistant/bar/width', height: 'assistant/launcher/height-lg', padLeft: 'assistant/launcher/padding-start', padRight: 'assistant/launcher/padding-end',
      radius: 'assistant/bar/radius', fill: 'assistant/panel/background', stroke: MOVING, strokeWidth: 'assistant/edge/width', effect: 'shadow/glow', children: [dots, control('End chat', 'End chat', 'close')],
    }
  }
  const voice = view === 'Panel voice', thinking = view === 'Panel thinking'
  if (view === 'Expanded') {
    return {
      k: 'frame', ...panelFrame, height: 'assistant/panel/expanded-height', padBottom: 'assistant/panel/padding',
      children: [
        {
          // The name centred over a gradient line, Collapse at the end (a spacer as wide keeps the name centred).
          k: 'frame', name: 'Header', dir: 'H', align: 'between', height: 'assistant/panel/header-height', padX: 'assistant/panel/padding', stretch: true,
          children: [
            { k: 'frame', name: 'Header start', dir: 'H', size: 'icon-button/sm/size', children: [] },
            { k: 'frame', name: 'Header title', dir: 'H', gap: 'assistant/launcher/gap', children: [nameText('Title'), sparkles] },
            small('Collapse', 'collapse'),
            { k: 'frame', name: 'Header line', dir: 'H', width: 436, height: 'assistant/panel/header-line', fill: LINE, abs: { left: 0, bottom: 0 }, children: [] },
          ],
        },
        { k: 'frame', name: 'Top', dir: 'H', align: 'start', cross: 'start', gap: 'assistant/panel/gap', padX: 'assistant/panel/padding', stretch: true, fillHeight: true, children: [log(false, true)] },
        composer(false, true),
        controls(false, true),
      ],
    }
  }
  return {
    k: 'frame', ...panelFrame, padX: 'assistant/panel/padding', padY: 'assistant/panel/padding',
    children: [
      { k: 'frame', name: 'Top', dir: 'H', align: 'start', cross: 'start', gap: 'assistant/panel/gap', stretch: true, children: [log(thinking, false), small('Expand', 'expand')] },
      composer(voice, false),
      controls(voice, false),
    ],
  }
}

export const assistant = {
  id: 'assistant',
  name: 'Assistant',
  page: 'Assistant',
  storybook: 'AcmeCo / Assistant',
  code: 'src/components/Assistant/Assistant.tsx',
  guidance: 'src/components/Assistant/Assistant.guidance.md',
  tokens: 'tokens/components/assistant.json',
  tokenPrefix: 'assistant.',
  status: 'Ready',
  uses: ['Icon button', 'Text field'],
  axes: { View: VIEWS },
  grid: { columns: 'View', rowGroups: null, rows: null },
  gridNote: 'Stills of each view (decision 33): launcher → connecting (its edge slides and the dots bounce in code, unless reduced motion) → docked panel (thinking, Voice Mode on) → expanded. The gradients are bound to assistant/accent/* and assistant/edge/light. Not modal: the page stays usable beside it.',
  properties: [],
  variants: VIEWS.map((View) => ({ props: { View }, tree: tree(View) })),
  anatomy: [
    { part: 'Panel', tokens: 'assistant/bar/width (440px), assistant/panel/radius (8px), a 2px gradient edge (assistant/accent/*, assistant/edge/light), shadow/raised + shadow/glow', at: 'right' },
    { part: 'Conversation', tokens: 'a log: assistant/message/* (16/24); your messages on the right in a grey bubble (assistant/message/user-*)', layer: 'Log', at: 'left' },
    { part: 'Expand', tokens: 'a plain Icon button (sm) that opens the taller view', layer: 'Expand', at: 'top' },
    { part: 'Text box and Send', tokens: 'a Text field (label for screen readers only) and a primary Icon button (md), assistant/toggle/gap apart', layer: 'Composer', at: 'left' },
    { part: 'Voice Mode and End chat', tokens: '32px outlined controls (assistant/toggle/*), 4px corners; Voice Mode on is filled with the accent', layer: 'Controls', at: 'left' },
  ],
  anatomyVariant: { View: 'Panel' },
  parity: {
    story: ['acmeco-assistant--launcher', 'acmeco-assistant--connecting', 'acmeco-assistant--panel', 'acmeco-assistant--panel-thinking', 'acmeco-assistant--panel-voice', 'acmeco-assistant--panel-expanded'],
    cells: "#storybook-root [class*='_launcher_'], #storybook-root [class*='_bar_'], #storybook-root section",
    order: VIEWS.map((View) => ({ View })),
    parts: [
      { name: 'Root', css: ':scope', layer: null, fields: ['radius', 'w', 'h'] },
      { name: 'Launcher name', css: 'span', layer: 'Name', fields: ['font', 'color', 'startInset'], only: { View: ['Launcher md', 'Launcher lg'] } },
      { name: 'Sparkles', css: 'svg', layer: 'Sparkles', fields: ['icon', 'endInset'], only: { View: ['Launcher md', 'Launcher lg'] } },
      { name: 'Dot', css: "[class*='_dots_'] > span", layer: 'Dot 1', fields: ['bg', 'w', 'h', 'startInset'], only: { View: ['Connecting', 'Panel thinking'] } },
      { name: 'End chat', css: "[class*='_bar_'] > button, [class*='_controls_'] > button:last-child", layer: 'End chat', fields: ['border', 'radius', 'h', 'w', 'padL', 'endInset'], only: { View: ['Connecting', 'Panel', 'Panel thinking', 'Panel voice', 'Expanded'] } },
      { name: 'End chat label', css: "[class*='_bar_'] > button, [class*='_controls_'] > button:last-child", layer: 'End chat label', fields: ['font', 'color'], only: { View: ['Connecting', 'Panel', 'Panel thinking', 'Panel voice', 'Expanded'] } },
      { name: 'Reply', css: "[class*='_reply_']", layer: 'Reply 1', fields: ['font', 'color', 'w', 'startInset', 'topInset'], only: { View: ['Panel', 'Panel thinking', 'Panel voice', 'Expanded'] } },
      { name: 'User message', css: "[class*='_user_']", layer: 'User message', fields: ['bg', 'radius', 'w', 'h', 'padL', 'padT', 'endInset'], only: { View: ['Panel', 'Panel thinking', 'Panel voice', 'Expanded'] } },
      { name: 'Composer', css: 'form', layer: 'Composer', fields: ['gap', 'h', 'topInset'], only: { View: ['Panel', 'Panel thinking', 'Panel voice', 'Expanded'] } },
      { name: 'Send', css: 'form button', layer: 'Send', fields: ['bg', 'w', 'h'], only: { View: ['Panel', 'Panel thinking', 'Panel voice', 'Expanded'] } },
      { name: 'Voice Mode', css: "[class*='_controls_'] > button:first-child", layer: 'Voice Mode', fields: ['radius', 'h', 'w', 'padL'], only: { View: ['Panel', 'Panel thinking', 'Panel voice', 'Expanded'] } },
      { name: 'Voice Mode label', css: "[class*='_controls_'] > button:first-child", layer: 'Voice Mode label', fields: ['font', 'color'], only: { View: ['Panel', 'Panel thinking', 'Panel voice', 'Expanded'] } },
      { name: 'Expand', css: "button[aria-label='Expand conversation']", layer: 'Expand', fields: ['w', 'h', 'endInset', 'topInset'], only: { View: ['Panel', 'Panel thinking', 'Panel voice'] } },
      { name: 'Header', css: "[class*='_header_']", layer: 'Header', fields: ['h'], only: { View: 'Expanded' } },
      { name: 'Header title', css: "[class*='_headerTitle_']", layer: 'Title', fields: ['font', 'color'], only: { View: 'Expanded' } },
    ],
  },
  specsBy: null,
  specs: () => ['assistant/bar/width', 'assistant/panel/radius', 'assistant/panel/padding', 'assistant/panel/gap', 'assistant/edge/width', 'assistant/launcher/height-md', 'assistant/launcher/height-lg', 'assistant/toggle/height', 'assistant/message/gap', 'assistant/panel/expanded-height'],
}
