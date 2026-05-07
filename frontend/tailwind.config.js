/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      // All sizes reference CSS variables so dark/light switching is instant
      colors: {
        q: {
          bg0:          'var(--q-bg0)',
          bg1:          'var(--q-bg1)',
          bg2:          'var(--q-bg2)',
          bg3:          'var(--q-bg3)',
          border:       'var(--q-border)',
          'border-soft':'var(--q-border-soft)',
          text:         'var(--q-text)',
          text2:        'var(--q-text2)',
          text3:        'var(--q-text3)',
          accent:       'var(--q-accent)',
          'accent-dim': 'var(--q-accent-dim)',
          'accent-border':'var(--q-accent-border)',
          red:          'var(--q-red)',
          green:        'var(--q-green)',
        },
      },
      // +5 px across the board (Tailwind defaults: xs=12, sm=14, base=16, lg=18)
      fontSize: {
        xxs:  ['13px', { lineHeight: '17px' }],
        xs:   ['16px', { lineHeight: '21px' }],
        sm:   ['18px', { lineHeight: '25px' }],
        base: ['20px', { lineHeight: '28px' }],
        lg:   ['22px', { lineHeight: '30px' }],
        xl:   ['26px', { lineHeight: '34px' }],
        '2xl':['30px', { lineHeight: '38px' }],
      },
      borderRadius: { card: '13px' },
      boxShadow:    { card: '0 4px 24px rgba(0,0,0,0.5)' },
    },
  },
  plugins: [],
}
