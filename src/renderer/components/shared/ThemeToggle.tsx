import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'

export function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors"
      title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
    >
      {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      <span>{theme === 'light' ? '暗色模式' : '亮色模式'}</span>
    </button>
  )
}
