import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import clsx from 'clsx'
import { SettingsProvider } from './context/settings'
import { NetworkBackground } from './components/NetworkBackground'
import { Header } from './components/Header'
import { ModelSetup } from './components/ModelSetup'
import { VoiceClone } from './components/VoiceClone'
import { CustomVoice } from './components/CustomVoice'
import { VoiceDesign } from './components/VoiceDesign'

const TABS = [
  { id: 'voice-clone',  full: '🎙 Voice Clone',  short: '🎙 Clone',  hint: 'Requires: Base (Voice Clone)' },
  { id: 'custom-voice', full: '🗣 Custom Voice', short: '🗣 Custom', hint: 'Requires: CustomVoice' },
  { id: 'voice-design', full: '✨ Voice Design', short: '✨ Design', hint: 'Requires: VoiceDesign' },
]

function Inner() {
  const [loadedModels, setLoadedModels] = useState<string[]>([])
  const activeStep = loadedModels.length > 0 ? 2 : 1

  return (
    <div className="min-h-screen bg-q-bg0 relative">
      <NetworkBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <Header activeStep={activeStep} />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ModelSetup onLoaded={setLoadedModels} />

          <Tabs.Root defaultValue="voice-clone">
            <Tabs.List
              className="flex gap-0 border-b border-q-border mb-5 overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              {TABS.map(tab => (
                <Tabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  title={tab.hint}
                  className={clsx(
                    'flex-shrink-0 px-3 py-2.5 sm:px-5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-all duration-150 whitespace-nowrap',
                    'text-q-text3 border-transparent hover:text-q-text2 hover:border-q-border',
                    'data-[state=active]:text-q-accent data-[state=active]:border-q-accent',
                    'focus:outline-none',
                  )}
                >
                  <span className="sm:hidden">{tab.short}</span>
                  <span className="hidden sm:inline">{tab.full}</span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value="voice-clone"><VoiceClone /></Tabs.Content>
            <Tabs.Content value="custom-voice"><CustomVoice /></Tabs.Content>
            <Tabs.Content value="voice-design"><VoiceDesign /></Tabs.Content>
          </Tabs.Root>
        </main>
        <footer className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center gap-2.5">
          <a href="https://github.com/rodlunt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-q-text3 hover:text-q-text2 transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span className="text-xs font-medium">rodlunt</span>
          </a>
          <span className="text-q-text3/40 text-xs">·</span>
          <span className="text-xs font-medium text-q-text3">MIT © 2026</span>
        </footer>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <Inner />
    </SettingsProvider>
  )
}
