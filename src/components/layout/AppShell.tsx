import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Drawer } from '@/components/ui/Drawer'
import { Sidebar as MobileSidebar } from '@/components/layout/Sidebar'

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text-primary)] print:h-auto print:overflow-visible">
      <div className="hidden md:block print:hidden">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col print:overflow-visible">
        <div className="print:hidden">
          <Topbar />
        </div>
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 print:overflow-visible print:pb-0">
          <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-7 md:py-7 print:max-w-none print:p-0">
            <Outlet />
          </div>
        </main>
      </div>

      <div className="print:hidden">
        <MobileNav onMenu={() => setMobileMenuOpen(true)} />
      </div>

      <Drawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} title="Menu">
        <div className="-mx-6 -my-5">
          <MobileSidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
        </div>
      </Drawer>
    </div>
  )
}
