import React, { useState } from 'react'
import Sidebar from './Sidebar/app-sidebar'
import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '../ui/sidebar'
import AppSidebar from './Sidebar/app-sidebar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  const [open, setOpen] = useState(true)
  return (
     <div className="flex h-screen">
      {/* Sidebar */}
      <SidebarProvider defaultOpen={open} onOpenChange={setOpen}>
        <AppSidebar/>
      </SidebarProvider>
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* <Header /> */}
        {/* Your dashboard content goes here */}
        <Outlet />
      </main>
    </div>
  )
}

export default Layout