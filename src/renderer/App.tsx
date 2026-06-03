import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { AppLayout } from '@/layouts/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { HardwarePage } from '@/pages/HardwarePage'
import { DiskOverviewPage } from '@/pages/DiskOverviewPage'
import { RealtimePage } from '@/pages/RealtimePage'
import { DiskAnalysisPage } from '@/pages/DiskAnalysisPage'

export default function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/hardware" element={<HardwarePage />} />
          <Route path="/disk" element={<DiskOverviewPage />} />
          <Route path="/realtime" element={<RealtimePage />} />
          <Route path="/analysis" element={<DiskAnalysisPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
