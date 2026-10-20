import type { Meta, StoryObj } from '@storybook/react-vite'
import pairsJson from '../../tokens/contrast-pairs.json'
import { checkPair, type ContrastPair } from '../lib/contrast'
import { Page, Section } from './Doc'
import { allTokens } from './tokens-data'

// The same pair list and the same maths as scripts/check-contrast.mjs (CI),
// so this page and the CI check can never disagree.
const results = (pairsJson.pairs as ContrastPair[]).map((p) => checkPair(p, allTokens))

const KIND: Record<ContrastPair['kind'], string> = {
  text: 'Text (WCAG 1.4.3, 4.5:1)',
  ui: 'Boundaries, focus and states (WCAG 1.4.11, 3:1)',
  exempt: 'Disabled (exempt; held to 3:1 by choice)',
}

function ContrastPage() {
  const passed = results.filter((r) => r.pass).length
  return (
    <Page
      title="Contrast"
      intro={
        <>
          <p>
            <strong>{passed} of {results.length} pairs pass.</strong> Every colour pairing the semantic
            tokens are designed for, measured live from the token files with the WCAG 2.x formula.
            The same list fails CI if any pair drops below its minimum. Ratios are rounded down.
          </p>
          <p>
            Two findings shaped the tokens: the blue focus ring is only 1.87:1 on the navy auction
            banner (so dark surfaces get a white ring), and AcmeCo's observed control border
            <code> #b1b3b0</code> is 2.11:1 (now <code>#808386</code>).
          </p>
        </>
      }
    >
      {(Object.keys(KIND) as ContrastPair['kind'][]).map((kind) => (
        <Section key={kind} title={KIND[kind]}>
          <table className="fd-table">
            <thead>
              <tr>
                <th scope="col">Sample</th>
                <th scope="col">Foreground on background</th>
                <th scope="col">Ratio</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {results.filter((r) => r.kind === kind).map((r) => (
                <tr key={`${r.fg}|${r.bg}|${r.kind}`}>
                  <td>
                    {kind === 'ui' ? (
                      <span className="fd-pair fd-pair--ui" style={{ background: r.bgHex }}>
                        <span style={{ borderColor: r.fgHex }} />
                      </span>
                    ) : kind === 'exempt' ? (
                      // Shown as a real disabled control: that's what the exemption covers.
                      <button type="button" disabled className="fd-pair" style={{ background: r.bgHex, color: r.fgHex, border: 0, font: 'inherit' }}>Aa</button>
                    ) : (
                      <span className="fd-pair" style={{ background: r.bgHex, color: r.fgHex }}>Aa</span>
                    )}
                  </td>
                  <td>
                    <code className="fd-token">{r.fg}</code>
                    <code className="fd-var">on {r.bg}{r.backdrop ? ` (over ${r.backdrop})` : ''}</code>
                    {r.note && <p className="fd-note">{r.note}</p>}
                  </td>
                  <td><code className="fd-value">{r.ratio.toFixed(2)}:1</code><code className="fd-var">min {r.min}:1</code></td>
                  <td className={r.pass ? 'fd-pass' : 'fd-fail'}>{r.pass ? 'Pass' : 'Fail'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      ))}
    </Page>
  )
}

const meta = {
  title: 'Foundations/Contrast',
  component: ContrastPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContrastPage>
export default meta
export const Contrast: StoryObj<typeof meta> = {}
