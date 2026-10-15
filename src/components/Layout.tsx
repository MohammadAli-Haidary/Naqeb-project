import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Warehouse, ShoppingCart, 
  DollarSign, Users, Truck, Calculator, Wrench, 
  BarChart3, Settings, Menu, X, Bell, LogOut,
  BookOpen
} from 'lucide-react';

interface LayoutProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { path: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/sales', label: 'فروش', icon: ShoppingCart },
  { path: '/purchases', label: 'خرید', icon: Truck },
  { path: '/products', label: 'محصولات', icon: Package },
  { path: '/inventory', label: 'انبار', icon: Warehouse },
  { path: '/customers', label: 'مشتریان', icon: Users },
  { path: '/suppliers', label: 'تأمین‌کنندگان', icon: Truck },
  { path: '/finance', label: 'مالی و حسابداری', icon: Calculator },
  { path: '/repairs', label: 'تعمیرات و ضمانت', icon: Wrench },
  { path: '/reports', label: 'گزارش‌ها', icon: BarChart3 },
  { path: '/settings', label: 'تنظیمات', icon: Settings },
  { path: '/setup', label: 'راهنمای نصب SQLite', icon: BookOpen },
];

export default function Layout({ sidebarOpen, setSidebarOpen }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl z-20`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">IT</span>
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="text-sm font-bold text-gold-400 whitespace-nowrap">امپریال تکنالوژی</h1>
                <p className="text-[10px] text-slate-400 whitespace-nowrap">Imperial Technology</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-primary-600/20 text-primary-300 border-r-4 border-primary-400'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={20} className="shrink-0" />
                    {sidebarOpen && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">م</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-300">مدیر سیستم</p>
                <p className="text-[10px] text-slate-500">admin@imperial.af</p>
              </div>
              <button className="text-slate-400 hover:text-red-400 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {navItems.find(item => item.path === location.pathname)?.label || 'داشبورد'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Date */}
            <div className="text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
              <i className="fas fa-calendar-alt ml-2 text-primary-500"></i>
              ۱۴۰۵/۰۷/۲۲
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
              <Bell size={20} />
              <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Quick Sale Button */}
            <NavLink
              to="/sales"
              className="bg-gradient-to-l from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg"
            >
              <i className="fas fa-cash-register ml-2"></i>
              فروش سریع
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
