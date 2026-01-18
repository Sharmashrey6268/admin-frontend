import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data || []);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Optimized derived data
  const categories = useMemo(() => {
    return [...new Set(projects.map(p => p.category).filter(Boolean))];
  }, [projects]);

  return (
    <>
      {/* ================= HERO ================= */}
      <div
        className="relative h-56 rounded-xl overflow-hidden text-white mb-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#4B1021]/80" />
        <div className="relative z-10 p-8">
          <h1 className="text-2xl font-serif">Welcome, Admin</h1>
          <p className="text-sm mt-2">
            {loading ? "Loading projects..." : `Total Projects: ${projects.length}`}
          </p>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-gray-100 rounded-xl animate-pulse"
            />
          ))
        ) : (
          <>
            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-xs uppercase opacity-60 mb-2">
                Total Projects
              </p>
              <h2 className="text-2xl font-serif">
                {projects.length}
              </h2>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-xs uppercase opacity-60 mb-2">
                Categories
              </p>
              <h2 className="text-2xl font-serif">
                {categories.length}
              </h2>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-xs uppercase opacity-60 mb-2">
                Recent Uploads
              </p>
              <h2 className="text-2xl font-serif">
                {projects.slice(0, 3).length}
              </h2>
            </div>
          </>
        )}
      </div>

      {/* ================= RECENT PROJECTS ================= */}
      <div className="bg-white rounded-xl p-8 shadow">
        <h3 className="font-serif mb-6">Recent Projects</h3>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-100 rounded animate-pulse"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-sm opacity-60">
            No projects added yet
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((p) => (
              <img
                key={p._id}
                src={p.images?.[0]?.url}
                alt={p.title}
                loading="lazy"
                className="h-40 w-full object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
