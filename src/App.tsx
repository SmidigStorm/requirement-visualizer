import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ViewAllRequirements } from "@/pages/ViewAllRequirements"
import { ViewCompleteness } from "@/pages/ViewCompleteness"

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <SidebarTrigger className="m-2" />
          <Routes>
            <Route path="/" element={<ViewAllRequirements />} />
            <Route path="/completeness" element={<ViewCompleteness />} />
          </Routes>
        </main>
      </SidebarProvider>
    </BrowserRouter>
  )
}

export default App
