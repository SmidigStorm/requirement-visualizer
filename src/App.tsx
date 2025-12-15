import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ViewAllRequirements } from "@/pages/ViewAllRequirements"

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger className="m-2" />
        <ViewAllRequirements />
      </main>
    </SidebarProvider>
  )
}

export default App
