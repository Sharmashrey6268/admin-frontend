import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    year: "",
    location: "",
    description: "",
  });

  const [images, setImages] = useState([]);

  /* ================= FETCH PROJECT ================= */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        const p = res.data;

        setForm({
          title: p.title || "",
          category: p.category || "",
          year: p.year || "",
          location: p.location || "",
          description: p.description || "",
        });

        setImages(
          p.images.map((img) => ({
            url: img.url,
          }))
        );
      } catch {
        alert("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  /* ================= IMAGE HANDLERS ================= */
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          { base64: reader.result },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.year) {
      alert("Required fields missing");
      return;
    }

    try {
      setUpdating(true); // 🔥 START LOADING

      await api.put(`/projects/${id}`, {
        ...form,
        images,
      });

      alert("Project updated successfully");
      navigate("/admin/projects");
    } catch {
      alert("Update failed");
    } finally {
      setUpdating(false); // 🔥 STOP LOADING
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="w-full flex justify-center px-4 lg:px-0">
      <div className="w-full max-w-5xl bg-white p-6 lg:p-10 rounded-xl shadow relative">
        
        {/* ❌ CANCEL BUTTON */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Discard changes?")) {
              navigate("/admin/projects");
            }
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          title="Cancel"
        >
          ✕
        </button>

        <h2 className="text-2xl font-serif mb-6">
          Edit Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* INPUTS */}
          {["title", "category", "year", "location"].map((field) => (
            <input
              key={field}
              className="border p-3 w-full rounded"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
              }
              disabled={updating}
            />
          ))}

          <textarea
            className="border p-3 w-full rounded"
            rows="4"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            disabled={updating}
          />

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block mb-2 font-medium">
              Project Images (max 5)
            </label>

            <label className={`inline-block border px-4 py-2 rounded text-sm
              ${updating ? "bg-gray-200 cursor-not-allowed" : "bg-gray-100 cursor-pointer hover:bg-gray-200"}
            `}>
              ➕ Add Images
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={updating}
                onChange={handleNewImages}
              />
            </label>
          </div>

          {/* IMAGE PREVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 flex flex-col"
              >
                <div className="bg-gray-100 rounded flex items-center justify-center h-48">
                  <img
                    src={img.url || img.base64}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={updating}
                  className="text-red-600 text-xs mt-2 self-end disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={updating}
              className={`px-6 py-3 rounded w-full lg:w-auto text-white
                ${updating ? "bg-gray-400 cursor-not-allowed" : "bg-[#4B1021]"}
              `}
            >
              {updating ? "Updating..." : "Update Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
