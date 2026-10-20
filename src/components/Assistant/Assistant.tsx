import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Button as AriaButton, ToggleButton } from 'react-aria-components'
import { useScrollableFocus } from '../../hooks/useScrollableFocus'
import { AudioLines, Close, Collapse, Expand, Mic, MicOff, Send, Sparkles } from '../../icons'
import { IconButton } from '../IconButton/IconButton'
import { TextField } from '../TextField/TextField'
import styles from './Assistant.module.css'
import { ds } from '../ds'

export interface AssistantMessage {
  id: string
  from: 'assistant' | 'user'
  text: string
}

// ---- Launcher ----

export interface AssistantLauncherProps {
  /** The assistant's name, shown on the pill. */
  name?: string
  /** `md` 40px (results and listing pages), `lg` 48px (homepage). */
  size?: 'md' | 'lg'
  onPress?: () => void
}

/** The floating pill that opens the assistant. */
export function AssistantLauncher({ name = 'AcmeCo AI', size = 'md', onPress }: AssistantLauncherProps) {
  return (
    <AriaButton className={`${styles.launcher} ${styles[size]}`} onPress={onPress} {...ds({ set: 'Assistant', props: { View: size === 'lg' ? 'Launcher lg' : 'Launcher md' } })}>
      <span>{name}</span>
      <Sparkles className={styles.launcherIcon} aria-hidden="true" />
    </AriaButton>
  )
}

// ---- Connecting bar ----

export interface AssistantConnectingProps {
  name?: string
  onEnd?: () => void
}

/** The short bar shown while the assistant connects: a moving edge and three dots. */
export function AssistantConnecting({ name = 'AcmeCo AI', onEnd }: AssistantConnectingProps) {
  return (
    <div className={`${styles.bar} ${styles.edge}`}>
      <span className={styles.dots} aria-hidden="true"><span /><span /><span /></span>
      <span role="status" className="sr-only">Connecting to {name}</span>
      <EndButton onPress={onEnd} />
    </div>
  )
}

// ---- Panel ----

export interface AssistantPanelProps {
  name?: string
  messages: AssistantMessage[]
  /** A reply is on its way: shows the dots and tells screen readers once. */
  isThinking?: boolean
  onSend: (text: string) => void
  voiceMode?: boolean
  onVoiceModeChange?: (on: boolean) => void
  micOn?: boolean
  onMicChange?: (on: boolean) => void
  onEnd?: () => void
  /** Shows the expand button (docked) or the collapse button (expanded). */
  onExpand?: () => void
  onCollapse?: () => void
  /** Escape: collapse the panel and keep the conversation. */
  onDismiss?: () => void
  /**
   * `docked`: a compact panel. `expanded`: the same panel, taller, with a header (name and
   * collapse button) over a gradient line, as on a reference product. Neither is modal.
   */
  variant?: 'docked' | 'expanded'
}

/** The conversation, the text box and the controls. Not modal: the page stays usable beside it. */
export function AssistantPanel({
  name = 'AcmeCo AI',
  messages,
  isThinking = false,
  onSend,
  voiceMode = false,
  onVoiceModeChange,
  micOn = true,
  onMicChange,
  onEnd,
  onExpand,
  onCollapse,
  onDismiss,
  variant = 'docked',
}: AssistantPanelProps) {
  const [draft, setDraft] = useState('')
  const { ref: logRef, scrolls } = useScrollableFocus<HTMLDivElement>([messages, isThinking])

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, isThinking, logRef])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && onDismiss) {
      event.stopPropagation()
      onDismiss()
    }
  }

  const docked = variant === 'docked'
  return (
    <section
      className={`${styles.panel} ${styles.edgeStatic} ${docked ? '' : styles.expanded}`}
      aria-label={name}
      onKeyDown={onKeyDown}
    >
      {!docked && (
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            {name}
            <Sparkles className={styles.launcherIcon} aria-hidden="true" />
          </h2>
          {onCollapse && (
            <span className={styles.headerEnd}>
              <IconButton label="Collapse conversation" icon={<Collapse />} size="sm" onPress={onCollapse} />
            </span>
          )}
        </div>
      )}
      <div className={styles.top}>
        <div
          ref={logRef}
          className={styles.log}
          role="log"
          aria-label={`Conversation with ${name}`}
          {...(scrolls ? { tabIndex: 0 } : {})}
        >
          {messages.map((m) => (
            <p key={m.id} className={m.from === 'user' ? styles.user : styles.reply}>
              <span className="sr-only">{m.from === 'user' ? 'You: ' : `${name}: `}</span>
              {m.text}
            </p>
          ))}
          {isThinking && <span className={styles.dots} aria-hidden="true"><span /><span /><span /></span>}
        </div>
        {docked && onExpand && <IconButton label="Expand conversation" icon={<Expand />} size="sm" onPress={onExpand} />}
      </div>
      {/* Mounted all along, so the change is announced; says "thinking" once instead of animating. */}
      <span role="status" className="sr-only">{isThinking ? `${name} is thinking` : ''}</span>

      <form className={styles.composer} onSubmit={submit}>
        <div className={styles.field}>
          <TextField
            label={`Message ${name}`}
            hideLabel
            value={draft}
            onChange={setDraft}
            placeholder={voiceMode ? "I'm listening. Say or type something…" : 'Ask me something…'}
            autoComplete="off"
          />
        </div>
        <IconButton label="Send" icon={<Send />} variant="primary" size="md" type="submit" />
      </form>

      <div className={styles.controls}>
        <ToggleButton className={styles.control} isSelected={voiceMode} onChange={onVoiceModeChange}>
          Voice Mode
          <AudioLines className={styles.controlIcon} aria-hidden="true" />
        </ToggleButton>
        {voiceMode && (
          // The label says what pressing does (not a pressed toggle: IconButton's "on" style is the dark blue save fill).
          <IconButton label={micOn ? 'Mute microphone' : 'Unmute microphone'} icon={micOn ? <Mic /> : <MicOff />} size="sm" onPress={() => onMicChange?.(!micOn)} />
        )}
        <span className={styles.spacer} />
        <EndButton onPress={onEnd} />
      </div>
    </section>
  )
}

function EndButton({ onPress }: { onPress?: () => void }) {
  return (
    <AriaButton className={styles.control} onPress={onPress}>
      End chat
      <Close className={styles.controlIcon} aria-hidden="true" />
    </AriaButton>
  )
}

// ---- Assistant (the whole flow) ----

export interface AssistantProps {
  name?: string
  /** Shown once when a conversation starts (a reference product repeats its greeting; this doesn't). */
  greeting?: string
  /** Where replies come from. The prototype has no AI: stories pass scripted replies. */
  respond: (text: string, history: AssistantMessage[]) => Promise<string>
  launcherSize?: 'md' | 'lg'
  /** How long the connecting bar shows, in ms. */
  connectDelay?: number
  /**
   * A question asked from elsewhere on the page ("Ask AcmeCo about …" on a result card,
   * decision 45): the assistant opens if it's closed and asks it. Give each question a new
   * id, so asking the same thing twice asks again.
   */
  question?: { id: string | number; text: string }
}

/**
 * The AI assistant: launcher → connecting bar → panel, which can expand to a taller view.
 * Escape collapses it and keeps the conversation; End chat clears it. Focus moves
 * to the text box when it opens and back to the launcher when it closes.
 */
export function Assistant({
  name = 'AcmeCo AI',
  greeting = 'Hi, how can I help? Ask me about a listing, a neighbourhood or what to search for.',
  respond,
  launcherSize = 'md',
  connectDelay = 1200,
  question,
}: AssistantProps) {
  const [state, setState] = useState<'closed' | 'connecting' | 'open'>('closed')
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [thinking, setThinking] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)
  const idPrefix = useId()
  const nextId = useRef(0)
  const message = (from: AssistantMessage['from'], text: string): AssistantMessage => ({ id: `${idPrefix}-${nextId.current++}`, from, text })

  // Connecting → open, greeting once per conversation.
  useEffect(() => {
    if (state !== 'connecting') return
    const timer = setTimeout(() => {
      setMessages((m) => (m.length ? m : [message('assistant', greeting)]))
      setState('open')
    }, connectDelay)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  // Focus: the text box on open, the launcher on close.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (state === 'open') root.querySelector<HTMLInputElement>('section input')?.focus()
    if (state === 'closed' && wasOpen.current) root.querySelector<HTMLButtonElement>('button')?.focus()
    wasOpen.current = state !== 'closed'
  }, [state])

  // Expand and collapse swap buttons: keep focus on the one that replaced the button pressed.
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    const label = expanded ? 'Collapse conversation' : 'Expand conversation'
    rootRef.current?.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)?.focus()
  }, [expanded])

  // A question from the page: open (or stay open), then ask it once the panel is showing.
  const pending = useRef<string | null>(null)
  useEffect(() => {
    if (!question) return
    pending.current = question.text
    setState((s) => (s === 'closed' ? 'connecting' : s))
  }, [question?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (state !== 'open' || pending.current === null) return
    const text = pending.current
    pending.current = null
    void send(text)
  }, [state, question?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const send = async (text: string) => {
    const history = [...messages, message('user', text)]
    setMessages(history)
    setThinking(true)
    try {
      const reply = await respond(text, history)
      setMessages((m) => [...m, message('assistant', reply)])
    } finally {
      setThinking(false)
    }
  }
  const end = () => {
    setExpanded(false)
    setMessages([])
    setVoiceMode(false)
    setMicOn(true)
    setState('closed')
  }

  const panelProps = {
    name,
    messages,
    isThinking: thinking,
    onSend: send,
    voiceMode,
    onVoiceModeChange: setVoiceMode,
    micOn,
    onMicChange: setMicOn,
    onEnd: end,
  }

  return (
    <div ref={rootRef} className={styles.assistant}>
      {state === 'closed' && <AssistantLauncher name={name} size={launcherSize} onPress={() => setState('connecting')} />}
      {state === 'connecting' && <AssistantConnecting name={name} onEnd={end} />}
      {state === 'open' && (
        <AssistantPanel
          {...panelProps}
          variant={expanded ? 'expanded' : 'docked'}
          onExpand={() => setExpanded(true)}
          onCollapse={() => setExpanded(false)}
          onDismiss={() => setState('closed')}
        />
      )}
    </div>
  )
}
