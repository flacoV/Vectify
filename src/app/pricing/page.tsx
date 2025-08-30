import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Pricing } from '@/components/pricing'

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <Pricing />
      </main>
      <Footer />
    </>
  )
}
