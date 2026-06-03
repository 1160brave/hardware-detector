import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout(): JSX.Element {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[var(--content-bg)]">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
