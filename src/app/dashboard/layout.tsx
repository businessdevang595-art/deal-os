import Link from "next/link";
import { LayoutDashboard, Home, Users, Calendar, Briefcase, Bell, Settings } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-white font-bold text-xl tracking-tighter">DEAL OS</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-white bg-slate-800 rounded-lg">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/properties" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 rounded-lg transition">
            <Home size={20} />
            Properties
          </Link>
          <Link href="/buyers" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 rounded-lg transition">
            <Users size={20} />
            Buyers
          </Link>
          <Link href="/site-visits" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 rounded-lg transition">
            <Calendar size={20} />
            Site Visits
          </Link>
          <Link href="/deals" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 rounded-lg transition">
            <Briefcase size={20} />
            Deals
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="space-y-2">
            <Link href="/notifications" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 rounded-lg transition">
              <Bell size={20} />
              Notifications
            </Link>
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 rounded-lg transition">
              <Settings size={20} />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 text-slate-900">
        {children}
      </main>

      {/* Mobile Nav (Bottom) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-50">
        <Link href="/dashboard" className="flex flex-col items-center text-blue-600">
          <LayoutDashboard size={24} />
          <span className="text-[10px] mt-1">Dash</span>
        </Link>
        <Link href="/properties" className="flex flex-col items-center text-slate-500">
          <Home size={24} />
          <span className="text-[10px] mt-1">Props</span>
        </Link>
        <Link href="/buyers" className="flex flex-col items-center text-slate-500">
          <Users size={24} />
          <span className="text-[10px] mt-1">Buyers</span>
        </Link>
        <Link href="/deals" className="flex flex-col items-center text-slate-500">
          <Briefcase size={24} />
          <span className="text-[10px] mt-1">Deals</span>
        </Link>
      </nav>
    </div>
  );
}
