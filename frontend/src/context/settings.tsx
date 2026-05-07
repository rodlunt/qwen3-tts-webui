import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'dark' | 'light' | 'auto'

interface SettingsValue {
  theme: Theme
  setTheme: (t: Theme) => void
  tooltips: boolean
  setTooltips: (v: boolean) => void
  animated: boolean
  setAnimated: (v: boolean) => void
  effectiveTheme: 'dark' | 'light'
}

const Ctx = createContext<SettingsValue>(null!)

function resolveTheme(t: Theme): 'dark' | 'light' {
  if (t === 'auto') return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  return t
}

function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = resolveTheme(t)
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, _setTheme] = useState<Theme>(() => (localStorage.getItem('q-theme') as Theme) ?? 'dark')
  const [tooltips, _setTooltips] = useState(() => localStorage.getItem('q-tooltips') !== '0')
  const [animated, _setAnimated] = useState(() => localStorage.getItem('q-animated') !== '0')

  useEffect(() => { applyTheme(theme) }, [theme])

  function setTheme(t: Theme) {
    _setTheme(t)
    localStorage.setItem('q-theme', t)
    applyTheme(t)
  }
  function setTooltips(v: boolean) { _setTooltips(v); localStorage.setItem('q-tooltips', v ? '1' : '0') }
  function setAnimated(v: boolean) { _setAnimated(v); localStorage.setItem('q-animated', v ? '1' : '0') }

  return (
    <Ctx.Provider value={{ theme, setTheme, tooltips, setTooltips, animated, setAnimated, effectiveTheme: resolveTheme(theme) }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSettings() { return useContext(Ctx) }
