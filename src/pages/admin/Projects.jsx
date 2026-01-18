import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Toast from "../../components/Toast";
import useToast from "../../hooks/useToast";

/* ================= DEBOUNCE HOOK ================= */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const Projects = () => {
  /* 🔥 TOAST HOOK — CORRECT PLACE */
  const { toast, showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");

  const debouncedSearch = useDebounce(search, 400);

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
        setFilteredProjects(res.data);
      } catch (err) {
        showToast("error", "Failed to fetch projects");
      }
    };

    fetchProjects();
  }, [showToast]);

  /* ================= SEARCH + FILTER ================= */
  useEffect(() => {
    let data = [...projects];

    if (debouncedSearch) {
      data = data.filter(
        (p) =>
          p.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.location?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (category !== "all") {
      data = data.filter((p) => p.category === category);
    }

    if (year !== "all") {
      data = data.filter((p) => String(p.year) === year);
    }

    setFilteredProjects(data);
  }, [debouncedSearch, category, year, projects]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project permanently?")) return;

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      showToast("success", "Project deleted successfully");
    } catch {
      showToast("error", "Failed to delete project");
    }
  };

  /* ================= SLIDER ================= */
  const nextImage = () => {
    setActiveImage((p) =>
      p === selectedProject.images.length - 1 ? 0 : p + 1
    );
  };

  const prevImage = () => {
    setActiveImage((p) =>
      p === 0 ? selectedProject.images.length - 1 : p - 1
    );
  };

  /* ================= FILTER DATA ================= */
  const categories = ["all", ...new Set(projects.map((p) => p.category))];
  const years = ["all", ...new Set(projects.map((p) => String(p.year)))];

  return (
    <div className="p-6">
      {/* 🔔 TOAST UI */}
      <Toast toast={toast} />

      <h2 className="text-2xl font-serif mb-6">Projects</h2>

      {/* ================= SEARCH & FILTER BAR ================= */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          placeholder="Search by title or location"
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c, index) => (
            <option key={`cat-${index}-${c}`} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {years.map((y, index) => (
            <option key={`year-${index}-${y}`} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* ================= PROJECT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProjects.map((p) => (
          <div key={p._id} className="bg-white rounded-xl shadow">
            <div className="h-48 overflow-hidden rounded-t-xl">
              <img
                src={p.images?.[0]?.url || "/placeholder.jpg"}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-semibold">{p.title}</h3>

              <p className="text-xs opacity-70">
                {p.category} • {p.year}
              </p>

              <p className="text-sm text-gray-600">
                {p.description
                  ? p.description.slice(0, 80) +
                    (p.description.length > 80 ? "..." : "")
                  : "No description"}
              </p>

              <div className="flex justify-between pt-2 text-sm">
                <button
                  onClick={() => {
                    setSelectedProject(p);
                    setActiveImage(0);
                  }}
                  className="border px-3 py-1 rounded"
                >
                  Explore
                </button>

                <div className="space-x-3">
                  <Link
                    to={`/admin/projects/edit/${p._id}`}
                    className="text-blue-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EXPLORE MODAL ================= */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white max-w-5xl w-full p-6 rounded-xl relative">
            <button
              className="absolute top-4 right-4 text-xl"
              onClick={() => setSelectedProject(null)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-serif">
              {selectedProject.title}
            </h2>

            <p className="text-sm opacity-70">
              {selectedProject.category} • {selectedProject.year} •{" "}
              {selectedProject.location}
            </p>

            <p className="mt-4 whitespace-pre-line">
              {selectedProject.description}
            </p>

            <div className="relative mt-6">
              <div className="h-[400px] overflow-hidden rounded">
                <img
                  src={selectedProject.images[activeImage].url}
                  className="h-full w-full object-cover"
                />
              </div>

              {selectedProject.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 bg-white px-3"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 bg-white px-3"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
