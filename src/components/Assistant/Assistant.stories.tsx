import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { listings } from '../../data/fixtures'
import { Assistant, AssistantConnecting, AssistantLauncher, AssistantPanel, type AssistantMessage } from './Assistant'
import guidance from './Assistant.guidance.md?raw'

const page = within(document.body)
const listing = listings[0]

// Scripted replies: the prototype has no AI. Synthetic content about a synthetic listing.
async function scripted(text: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 400))
  const q = text.toLowerCase()
  if (q.includes('parking')) return `${listing.title} includes covered parking at no extra monthly cost (placeholder answer).`
  if (q.includes('price') || q.includes('rent')) return `Space at ${listing.title} is listed at $28.50 per square foot per year (placeholder answer).`
  return `Here's what I found about ${listing.title}: ${listing.size.min.toLocaleString()} to ${listing.size.max.toLocaleString()} SF of ${listing.type.toLowerCase()} space in Denver (placeholder answer).`
}

const conversation: AssistantMessage[] = [
  { id: '1', from: 'assistant', text: 'Hi, how can I help? Ask me about a listing, a neighbourhood or what to search for.' },
  { id: '2', from: 'user', text: 'Is there parking?' },
  { id: '3', from: 'assistant', text: `${listing.title} includes covered parking at no extra monthly cost (placeholder answer).` },
]

const meta = {
  title: 'AcmeCo/Assistant',
  component: Assistant,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: guidance } } },
  args: { respond: scripted },
} satisfies Meta<typeof Assistant>

export default meta
type Story = StoryObj<typeof meta>

// ---- The whole flow ----

export const Flow: Story = {
  name: 'Flow (launcher → connecting → conversation)',
  args: { connectDelay: 300 },
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: '520px', alignItems: 'flex-end', padding: 'var(--space-3)' }}>
      <Assistant {...args} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'AcmeCo AI' }))
    // Connecting is announced, then the panel opens with focus in the text box.
    await expect(canvas.getByRole('status')).toHaveTextContent('Connecting to AcmeCo AI')
    const panel = await canvas.findByRole('region', { name: 'AcmeCo AI' })
    const input = within(panel).getByRole('textbox', { name: 'Message AcmeCo AI' })
    await waitFor(() => expect(input).toHaveFocus())
    const log = within(panel).getByRole('log', { name: 'Conversation with AcmeCo AI' })
    // The greeting appears once.
    await expect(within(log).getAllByText(/how can I help/)).toHaveLength(1)
    // Enter sends; the reply arrives in the log, each message says who it's from.
    await userEvent.type(input, 'Is there parking?{Enter}')
    await expect(within(log).getByText('Is there parking?')).toBeInTheDocument()
    await within(log).findByText(/covered parking/)
    await expect(log).toHaveTextContent('You: Is there parking?')
    // Voice Mode is a toggle; the microphone appears with it.
    const voice = within(panel).getByRole('button', { name: 'Voice Mode' })
    await userEvent.click(voice)
    await expect(voice).toHaveAttribute('aria-pressed', 'true')
    const mic = within(panel).getByRole('button', { name: 'Mute microphone' })
    await userEvent.click(mic)
    await expect(within(panel).getByRole('button', { name: 'Unmute microphone' })).toBeInTheDocument()
    // Escape collapses it and keeps the conversation; focus returns to the launcher.
    await userEvent.click(input)
    await userEvent.keyboard('{Escape}')
    const launcher = await canvas.findByRole('button', { name: 'AcmeCo AI' })
    await waitFor(() => expect(launcher).toHaveFocus())
    await userEvent.click(launcher)
    const again = await canvas.findByRole('region', { name: 'AcmeCo AI' })
    await expect(within(again).getByText('Is there parking?')).toBeInTheDocument()
    // End chat clears it.
    await userEvent.click(within(again).getByRole('button', { name: 'End chat' }))
    const fresh = await canvas.findByRole('button', { name: 'AcmeCo AI' })
    await waitFor(() => expect(fresh).toHaveFocus())
    fresh.blur()
  },
}

export const Expanded: Story = {
  name: 'Expanded (taller panel with a header)',
  args: { connectDelay: 0 },
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: '700px', alignItems: 'flex-end', padding: 'var(--space-3)' }}>
      <Assistant {...args} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'AcmeCo AI' }))
    const panel = await canvas.findByRole('region', { name: 'AcmeCo AI' })
    await userEvent.click(within(panel).getByRole('button', { name: 'Expand conversation' }))
    // Same panel, not a modal: a header appears and focus moves to Collapse.
    await expect(page.queryByRole('dialog')).toBeNull()
    // (waitFor: the panel fades in, and fully transparent counts as not visible.)
    await waitFor(() => expect(within(panel).getByRole('heading', { name: 'AcmeCo AI' })).toBeVisible())
    const collapse = within(panel).getByRole('button', { name: 'Collapse conversation' })
    await waitFor(() => expect(collapse).toHaveFocus())
    await expect(within(panel).getByRole('log')).toHaveTextContent('how can I help')
    // Collapse returns focus to Expand.
    await userEvent.click(collapse)
    const expand = within(panel).getByRole('button', { name: 'Expand conversation' })
    await waitFor(() => expect(expand).toHaveFocus())
    // Leave it expanded for the snapshot.
    await userEvent.click(expand)
    within(panel).getByRole('button', { name: 'Collapse conversation' }).blur()
  },
}

export const PanelExpanded: Story = {
  name: 'Panel (expanded)',
  render: () => (
    <div style={{ padding: 'var(--space-4)' }}>
      <AssistantPanel variant="expanded" messages={conversation} onSend={() => {}} onCollapse={() => {}} />
    </div>
  ),
}

// ---- Each state, for visual review ----

export const Launcher: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-3)' }}>
      <AssistantLauncher size="md" />
      <AssistantLauncher size="lg" />
    </div>
  ),
}

export const Connecting: Story = {
  render: () => (
    <div style={{ padding: 'var(--space-4)' }}>
      <AssistantConnecting />
    </div>
  ),
}

function PanelDemo({ thinking = false, voice = false }: { thinking?: boolean; voice?: boolean }) {
  const [voiceMode, setVoiceMode] = useState(voice)
  const [micOn, setMicOn] = useState(true)
  return (
    <div style={{ padding: 'var(--space-4)' }}>
      <AssistantPanel
        messages={conversation}
        isThinking={thinking}
        onSend={() => {}}
        voiceMode={voiceMode}
        onVoiceModeChange={setVoiceMode}
        micOn={micOn}
        onMicChange={setMicOn}
        onExpand={() => {}}
      />
    </div>
  )
}

export const Panel: Story = { name: 'Panel (conversation)', render: () => <PanelDemo /> }
export const PanelThinking: Story = {
  name: 'Panel (thinking)',
  render: () => <PanelDemo thinking />,
  play: async ({ canvas }) => {
    // "Thinking" is announced as text; the dots are decoration.
    await expect(canvas.getByText('AcmeCo AI is thinking')).toBeInTheDocument()
  },
}
export const PanelVoice: Story = { name: 'Panel (Voice Mode on)', render: () => <PanelDemo voice /> }

export const OverListing: Story = {
  name: 'In place (over a listing photo)',
  render: () => (
    <div style={{ position: 'relative', height: '560px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <img src={listing.photos[0].src} alt={listing.photos[0].alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', right: 'var(--space-4)', bottom: 'var(--space-4)', left: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
        <AssistantPanel messages={conversation} onSend={() => {}} onExpand={() => {}} />
      </div>
    </div>
  ),
}
