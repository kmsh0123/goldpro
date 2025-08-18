import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from 'react-router-dom'
import AppSidebarAccordion from "./app-sidebar-accordion"
// import { sidebarRoutes } from "@/router/dashboardRoute";

const AppSidebar = () => {
  return (
     <Sidebar>
     <SidebarHeader className="text-center text-2xl font-bold mb-4">
      Gold Pro
     </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="space-y-3">
         <AppSidebarAccordion/>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar