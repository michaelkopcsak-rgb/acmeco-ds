// Shared building blocks for the Foundations pages: the page frame, evidence
// label badges and the token table. Documentation only, not library components.
import type { ReactNode } from 'react'
import { formatValue, type EvidenceLabel, type TokenInfo } from './tokens-data'
import './foundations.css'

export function Page({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <main className="fd-page">
      <p className="fd-prototype">Prototype · AcmeCo is a fictional brand</p>
      <h1 className="fd-title">{title}</h1>
      <div className="fd-intro">{intro}</div>
      {children}
    </main>
  )
}

export function Section({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className="fd-section">
      <h2 className="fd-section-title">{title}</h2>
      {intro && <p className="fd-section-intro">{intro}</p>}
      {children}
    </section>
  )
}

const LABEL_CLASS: Record<EvidenceLabel, string> = {
  OBSERVED: 'fd-label--observed',
  'LEGACY-NAMED': 'fd-label--named',
  PROPOSED: 'fd-label--proposed',
  'BENCHMARK-INFORMED': 'fd-label--benchmark',
  'REFERENCE-OBSERVED': 'fd-label--acmeco',
}

export function Labels({ labels }: { labels: EvidenceLabel[] }) {
  return (
    <span className="fd-labels">
      {labels.map((l) => (
        <span key={l} className={`fd-label ${LABEL_CLASS[l]}`}>{l}</span>
      ))}
    </span>
  )
}

/** One row per token: a preview, its names, value, labels and evidence note. */
export function TokenTable({ tokens, preview }: { tokens: TokenInfo[]; preview?: (t: TokenInfo) => ReactNode }) {
  return (
    <table className="fd-table">
      <thead>
        <tr>
          {preview && <th scope="col"><span className="fd-visually-hidden">Preview</span></th>}
          <th scope="col">Token</th>
          <th scope="col">Value</th>
          <th scope="col">Evidence</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((t) => (
          <tr key={t.path}>
            {preview && <td className="fd-preview-cell">{preview(t)}</td>}
            <td>
              <code className="fd-token">{t.path}</code>
              <code className="fd-var">{t.cssVar}</code>
            </td>
            <td>
              {t.reference && <code className="fd-ref">→ {t.reference}</code>}
              <code className="fd-value">{formatValue(t.resolved)}</code>
            </td>
            <td>
              <Labels labels={t.labels} />
              <p className="fd-note">{t.note}</p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
