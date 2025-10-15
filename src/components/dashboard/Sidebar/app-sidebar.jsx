import { Calendar, Home, Inbox, LogOut, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useNavigate } from 'react-router-dom'
import AppSidebarAccordion from "./app-sidebar-accordion"
import Cookies from "js-cookie"
import Swal from "sweetalert2"
// import { sidebarRoutes } from "@/router/dashboardRoute";

const AppSidebar = () => {
  const nav = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("token");
        Swal.fire(
          'Logged out!',
          'You have been logged out.',
          'success'
        ).then(() => {
          nav("/login");
        });
      }
    });
  }
  return (
     <Sidebar>
     <SidebarHeader className="text-center text-2xl font-bold mb-4">
      <div className="flex justify-center">
        <img src="/images/gold_pro_logo.png" className="w-[75%] relative right-2.5" />
      </div>
     </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="space-y-3">
         <AppSidebarAccordion/>
          <SidebarMenuItem 
            as="button" 
            onClick={handleLogout} 
            className="flex items-center justify-center space-x-2 cursor-pointer mx-auto bg-red-500 p-3 px-3 rounded-4xl text-white hover:bg-red-900 w-[75%]"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar