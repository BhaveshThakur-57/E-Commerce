import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  ];

  return (
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
  );
};

export default AdminSidebar;
