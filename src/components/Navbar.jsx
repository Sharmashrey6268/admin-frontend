import { Link } from "react-router-dom";
import { logout } from "../utils/auth";

const Navbar = () => {
  return (
    <nav className="admin-navbar">
      <h3>Admin Panel</h3>
      <div>
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/projects">Projects</Link>
        <Link to="/admin/add-project">Add Project</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
