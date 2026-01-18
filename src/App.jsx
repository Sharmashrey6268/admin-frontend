import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/* ================= ADMIN PAGES ================= */
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import AddProject from "./pages/admin/AddProject";
import EditProject from "./pages/admin/EditProject";
import AdminProjects from "./pages/admin/Projects";

/* ================= LAYOUT & AUTH ================= */
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginRoute from "./components/LoginRoute";

/* ================= PAGE ANIMATION ================= */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.45, ease: "easeIn" },
  },
};

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ================= LOGIN ================= */}
        <Route
          path="/"
          element={
            <LoginRoute>
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Login />
              </motion.div>
            </LoginRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/add" element={<AddProject />} />
          <Route path="projects/edit/:id" element={<EditProject />} />
        </Route>

      </Routes>
    </AnimatePresence>
  );
}

export default App;
