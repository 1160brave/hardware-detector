import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Cpu,
  HardDrive,
  Activity,
  PieChart,
  Monitor
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/hardware', icon: Cpu, label: '硬件详情' },
  { to: '/disk', icon: HardDrive, label: '磁盘信息' },
  { to: '/realtime', icon: Activity, label: '实时监控' },
  { to: '/analysis', icon: PieChart, label: '磁盘分析' }
]

export function Sidebar(): JSX.Element {
  const isMac = typeof window !== 'undefined' && window.navigator.userAgent.includes('Macintosh')

  return (
    <aside className="w-48 h-full bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col select-none">
      {/* App Title */}
      <div
        className={cn(
          "flex flex-col justify-end gap-2 px-4 pb-3 border-b border-[var(--border-color)]",
          isMac ? "h-24 pt-10" : "h-14"
        )}
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <Monitor className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            硬件检测工具
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--border-color)] hover:text-[var(--text-primary)]'
              )
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-[var(--border-color)]">
        <ThemeToggle />
      </div>
    </aside>
  )
}
