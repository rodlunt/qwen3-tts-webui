import { useState } from 'react'
import { Settings } from 'lucide-react'
import clsx from 'clsx'
import { useSettings, type Theme } from '../context/settings'

const STEPS = [
  { n: 1, label: 'Model' },
  { n: 2, label: 'Voice' },
  { n: 3, label: 'Text' },
  { n: 4, label: 'Generate' },
]

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        'w-10 h-5.5 rounded-full border transition-all duration-200 relative flex-shrink-0',
        on ? 'bg-q-accent border-q-accent' : 'bg-q-bg3 border-q-border',
      )}
      style={{ height: '22px', width: '40px' }}
    >
      <span
        className={clsx(
          'absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-200',
          on ? 'bg-white translate-x-5' : 'bg-q-text3 translate-x-0.5',
        )}
      />
    </button>
  )
}

function ThemeBtn({ label, value, current, onClick }: { label: string; value: Theme; current: Theme; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex-1 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 border',
        current === value
          ? 'bg-q-accent/15 border-q-accent text-q-accent'
          : 'bg-q-bg3 border-q-border text-q-text3 hover:border-q-accent/50 hover:text-q-text2',
      )}
    >
      {label}
    </button>
  )
}

export function Header({ activeStep }: { activeStep: number }) {
  const [panelOpen, setPanelOpen] = useState(false)
  const { theme, setTheme, tooltips, setTooltips, animated, setAnimated } = useSettings()

  return (
    <>
      <header className="sticky top-0 z-50 bg-q-bg1 border-b border-q-border flex items-center gap-5 px-6 lg:px-8 py-3">
        {/* Wordmark */}
        <div className="flex-shrink-0">
          <div className="font-mono text-xxs font-semibold tracking-widest text-q-text uppercase">QWEN3 TTS</div>
          <div className="text-xxs text-q-text3 tracking-wide mt-0.5">Open-source voice synthesis, local and private</div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-1.5 flex-1 justify-center">
          {STEPS.map((step, i) => {
            const done   = step.n < activeStep
            const active = step.n === activeStep
            return (
              <div key={step.n} className="flex items-center gap-1.5">
                <div className="flex items-center gap-2">
                  <div className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center font-mono text-xxs font-semibold border transition-all duration-300 flex-shrink-0',
                    done   && 'border-q-green  bg-q-green/10  text-q-green',
                    active && 'border-q-accent bg-q-accent/10 text-q-accent shadow-[0_0_14px_rgba(14,219,207,0.2)]',
                    !done && !active && 'border-q-border bg-q-bg2 text-q-text3',
                  )}>
                    {step.n}
                  </div>
                  <span className={clsx(
                    'text-xxs font-semibold tracking-widest uppercase transition-colors duration-200 hidden sm:block',
                    done   && 'text-q-green',
                    active && 'text-q-accent',
                    !done && !active && 'text-q-text3',
                  )}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={clsx('w-8 h-px flex-shrink-0 transition-colors duration-300', done ? 'bg-q-green/40' : 'bg-q-border')} />
                )}
              </div>
            )
          })}
        </div>

        {/* Cog */}
        <button
          onClick={() => setPanelOpen(v => !v)}
          className="flex-shrink-0 w-9 h-9 rounded-lg border border-q-border bg-q-bg2 flex items-center justify-center text-q-text2 hover:border-q-accent hover:text-q-accent hover:bg-q-accent/10 transition-all duration-200"
        >
          <Settings size={15} />
        </button>
      </header>

      {/* Settings panel */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPanelOpen(false)} />
          <div className="fixed top-16 right-4 z-50 w-56 bg-q-bg2 border border-q-border rounded-2xl shadow-card p-4 flex flex-col gap-4">
            <p className="font-mono text-xxs tracking-widest uppercase text-q-text3">Preferences</p>

            {/* Theme */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-q-text2">Theme</span>
              <div className="flex gap-1.5">
                <ThemeBtn label="Auto"  value="auto"  current={theme} onClick={() => setTheme('auto')} />
                <ThemeBtn label="Dark"  value="dark"  current={theme} onClick={() => setTheme('dark')} />
                <ThemeBtn label="Light" value="light" current={theme} onClick={() => setTheme('light')} />
              </div>
            </div>

            {/* Tooltips */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-q-text2">Tooltips</span>
              <Toggle on={tooltips} onToggle={() => setTooltips(!tooltips)} />
            </div>

            {/* Background */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-q-text2">Animated background</span>
                <p className="text-xxs text-q-text3 mt-0.5">Static saves CPU</p>
              </div>
              <Toggle on={animated} onToggle={() => setAnimated(!animated)} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
