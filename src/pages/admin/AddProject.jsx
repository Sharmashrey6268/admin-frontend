import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Toast from "../../components/Toast";
import useToast from "../../hooks/useToast";

const AddProject = () => {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    category: "",
    year: "",
    location: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE SELECT (HD PREVIEW) ================= */
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      showToast("error", "Maximum 5 images allowed");
      return;
    }

    files.forEach((file) => {
      setImages((prev) => [
        ...prev,
        {
          file, // REAL FILE (important)
          preview: URL.createObjectURL(file), // 🔥 HD PREVIEW
          caption: "",
        },
      ]);
    });
  };

  /* ================= CONVERT FILE → BASE64 FOR BACKEND ================= */
  const prepareImagesPayload = async () => {
    const payload = [];

    for (const img of images) {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(img.file);
      });

      payload.push({
        base64,
        caption: img.caption || "Project Image",
      });
    }

    return payload;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (
      !form.title ||
      !form.category ||
      !form.year ||
      !form.location ||
      !form.description
    ) {
      showToast("error", "Please fill all fields");
      return;
    }

    if (images.length === 0) {
      showToast("error", "Please add at least one image");
      return;
    }

    try {
      setLoading(true);

      const imagePayload = await prepareImagesPayload();

      await api.post("/projects", {
        ...form,
        year: Number(form.year),
        images: imagePayload,
      });

      showToast("success", "Project added successfully");

      setTimeout(() => {
        navigate("/admin/projects");
      }, 700);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to add project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl bg-white p-8 rounded-xl shadow">
      <Toast toast={toast} />

      <h2 className="text-2xl font-serif mb-6">Add Project</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= BASIC INFO ================= */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Title"
            className="border p-3 rounded"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Category"
            className="border p-3 rounded"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="number"
            placeholder="Year"
            className="border p-3 rounded"
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
          <input
            placeholder="Location"
            className="border p-3 rounded"
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <textarea
          placeholder="Project Description"
          rows="4"
          className="border p-3 rounded w-full"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* ================= FILE BUTTON ================= */}
        <div>
          <label className="inline-block cursor-pointer bg-[#4B1021] text-white px-6 py-2 rounded">
            Choose Images
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleImages}
            />
          </label>
          <p className="text-xs mt-2 opacity-60">
            Max 5 images • JPG / PNG
          </p>
        </div>

        {/* ================= IMAGE PREVIEW (NO BLUR) ================= */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div key={i} className="border rounded-lg p-2">
              <div className="h-44 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                <img
                  src={img.preview}
                  alt="preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ================= SUBMIT ================= */}
        <button
          disabled={loading}
          className="bg-[#4B1021] text-white px-8 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Project"}
        </button>
      </form>
    </div>
  );
};

export default AddProject;
