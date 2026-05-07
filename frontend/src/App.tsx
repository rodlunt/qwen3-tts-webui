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
        <footer className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center gap-2.5 border-t border-q-border/40">
          <a href="https://github.com/rodlunt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-q-text3 hover:text-q-text2 transition-colors">
            <img src="https://github.com/rodlunt.png" className="w-6 h-6 rounded-full opacity-70 hover:opacity-100 transition-opacity" alt="rodlunt" />
            <span className="text-xs font-medium">rodlunt</span>
          </a>
          <span className="text-q-text3/40 text-xs">·</span>
          <span className="text-xs text-q-text3/60">MIT © 2026</span>
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
