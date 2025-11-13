import React, { useContext, useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  LogOut,
  Menu,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Outlet, NavLink } from "react-router-dom";

/**
 * Responsive dashboard shell
 * - Left sidebar (collapsible on mobile)
 * - Topbar with user info
 * - Outlet for child pages (Dashboard, Income, Expense)
 */

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/income", icon: <TrendingUp size={20} />, label: "Income" },
    { to: "/expense", icon: <TrendingDown size={20} />, label: "Expense" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed z-40 inset-y-0 left-0 w-64 transform bg-white border-r shadow-md transition-transform duration-300 md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600">ExpTrack</span>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg font-medium transition ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-indigo-50 text-gray-700"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="m-4 flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium transition"
          >
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between bg-white border-b px-4 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            {user?.avatarUrl ? (
              // <img
              //   src={`http://localhost:5000${user.avatarUrl}`}
              //   alt="avatar"
              //   className="w-9 h-9 rounded-full border object-cover"
              // />
              <img
                src={
                user.avatarUrl
                    ? `${BASE_URL}/${user.avatarUrl.replace(/\\/g, "/")}`
                    : "/default-avatar.png"
                }
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
              />    


            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <span className="font-medium hidden sm:block">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
