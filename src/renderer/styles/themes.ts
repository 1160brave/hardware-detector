export const themeColors = {
  light: {
    sidebarBg: '#ffffff',
    contentBg: '#f1f5f9',
    cardBg: '#ffffff',
    borderColor: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    accentCpu: '#3b82f6',
    accentMemory: '#8b5cf6',
    accentDisk: '#10b981',
    accentNetwork: '#f59e0b'
  },
  dark: {
    sidebarBg: '#0f172a',
    contentBg: '#020617',
    cardBg: '#1e293b',
    borderColor: '#334155',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    accentCpu: '#60a5fa',
    accentMemory: '#a78bfa',
    accentDisk: '#34d399',
    accentNetwork: '#fbbf24'
  }
}

export type Theme = 'light' | 'dark'
