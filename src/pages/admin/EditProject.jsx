import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    category: "",
    year: "",
    location: "",
    description: "",
  });

  const [images, setImages] = useState([]); 
  // images = [{ url?, base64?, caption }]

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
            caption: img.caption || "",
          }))
        );
      } catch (err) {
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
          {
            base64: reader.result,
            caption: "",
          },
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
      await api.put(`/projects/${id}`, {
        ...form,
        images,
      });

      alert("Project updated successfully");
      navigate("/admin/projects");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-serif mb-6">Edit Project</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          className="border p-3 w-full"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          className="border p-3 w-full"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          className="border p-3 w-full"
          placeholder="Year"
          value={form.year}
          onChange={(e) =>
            setForm({ ...form, year: e.target.value })
          }
        />

        <input
          className="border p-3 w-full"
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <textarea
          className="border p-3 w-full"
          rows="4"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleNewImages}
        />

        {/* IMAGE PREVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="border rounded p-2">
              <div className="h-32 overflow-hidden rounded">
                <img
                  src={img.url || img.base64}
                  className="h-full w-full object-cover"
                />
              </div>

              <input
                className="border p-2 mt-2 w-full text-sm"
                placeholder="Caption"
                value={img.caption}
                onChange={(e) => {
                  const updated = [...images];
                  updated[index].caption = e.target.value;
                  setImages(updated);
                }}
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-red-600 text-xs mt-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button className="bg-[#4B1021] text-white px-6 py-2 rounded">
          Update Project
        </button>
      </form>
    </div>
  );
};

export default EditProject;
