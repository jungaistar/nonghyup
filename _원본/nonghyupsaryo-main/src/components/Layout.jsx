import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children, withSidebar = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header onToggleSidebar={withSidebar ? () => setSidebarOpen((v) => !v) : null} />
      <div className="mx-auto flex max-w-screen-2xl">
        {withSidebar && (
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
