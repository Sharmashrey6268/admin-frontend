import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col text-white">

      {/* LOGO SPACE */}
      <div className="p-6 border-b border-white/10">
        <h2 className="font-serif tracking-widest text-sm">
          SHREE AAKAR
        </h2>
      </div>

      {/* NAV LINKS (SCROLLABLE IF NEEDED) */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">

        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${
              isActive
                ? "bg-[#C5A059] text-[#4B1021]"
                : "hover:bg-white/10"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/projects"
          end
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${
              isActive
                ? "bg-[#C5A059] text-[#4B1021]"
                : "hover:bg-white/10"
            }`
          }
        >
          Projects
        </NavLink>

        <NavLink
          to="/admin/projects/add"
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition ${
              isActive
                ? "bg-[#C5A059] text-[#4B1021]"
                : "hover:bg-white/10"
            }`
          }
        >
          Add Project
        </NavLink>

      </nav>
    </div>
  );
};

export default Sidebar;
