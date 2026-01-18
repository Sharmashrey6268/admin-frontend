import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo1 from "../assets/logo1.png";

const Topbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-[#FAF7F2] border-b border-[#C5A059]/60 px-4 flex justify-between items-center">

      {/* LEFT: MENU + LOGO */}
      <div className="flex items-center gap-3">
        
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-[#4B1021]"
        >
          <Menu size={24} />
        </button>

        <img src={logo1} alt="Logo" className="w-9" />

        <div className="leading-tight">
          <h1 className="font-serif text-sm tracking-[0.25em] text-[#3b2a1a]">
            SHREE AAKAR
          </h1>
          <p className="text-[10px] tracking-[0.35em] text-[#8b7a60] uppercase">
            Design Studio
          </p>
        </div>
      </div>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="border border-[#C5A059] text-[#C5A059] px-4 py-1 text-xs tracking-widest uppercase"
      >
        Logout
      </button>
    </header>
  );
};

export default Topbar;
