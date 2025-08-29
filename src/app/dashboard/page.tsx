import { DashboardHeader } from '@/components/dashboard/header'
import { DigitalizationArea } from '@/components/dashboard/digitalization-area'
import { HistorySection } from '@/components/dashboard/history-section'
import { StatsSection } from '@/components/dashboard/stats-section'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <StatsSection />
          <DigitalizationArea />
          <HistorySection />
        </div>
      </main>
    </div>
  )
}
