import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#FAF7F2]">

      {/* ===== SIDEBAR (DESKTOP) ===== */}
      <aside className="hidden md:block w-64 h-screen bg-[#4B1021] overflow-y-auto">
        <Sidebar />
      </aside>

      {/* ===== SIDEBAR (MOBILE DRAWER) ===== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 h-full bg-[#4B1021] overflow-y-auto">
            <Sidebar onLinkClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
