import { CourtStatusDashboard } from "@/components/court-status-dashboard"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Pereira Municipal Civil Courts - Pending Status Monitor</h1>
      <CourtStatusDashboard />
    </main>
  )
}

