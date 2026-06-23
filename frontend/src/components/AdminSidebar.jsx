import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Ticket, MessageSquare, DatabaseBackup } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Bulk Ops", path: "/admin/bulk", icon: DatabaseBackup },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Coupons", path: "/admin/coupons", icon: Ticket },
  { name: "Inquiries", path: "/admin/inquiries", icon: MessageSquare },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 pt-28 px-4 hidden md:flex flex-col gap-2 shrink-0 self-stretch min-h-screen">
        <p className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-widest px-4 mb-2">
          Admin Navigation
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 px-2 py-2 safe-bottom">
        <div className="flex items-center justify-around">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[3.5rem] ${
                  isActive
                    ? "text-brand-500"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? "bg-brand-500/10" : ""}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] leading-tight font-medium ${isActive ? "font-semibold" : ""}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default AdminSidebar;
