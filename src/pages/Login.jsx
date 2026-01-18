import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { toast, showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const colors = {
    maroon: "#410D1D",
    gold: "#C5A059",
    lightGold: "#E8D4A2",
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", data);

      // ✅ save token
      localStorage.setItem("token", res.data.token);

      showToast("success", "Login successful");

      // ✅ IMPORTANT: replace true (no back to login)
      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 700);
    } catch (err) {
      const message = err.response?.data?.message?.toLowerCase() || "";

      if (message.includes("email")) {
        showToast("error", "Invalid email address");
      } else if (message.includes("password")) {
        showToast("error", "Invalid password");
      } else {
        showToast("error", "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex text-white"
      style={{ backgroundColor: colors.maroon }}
    >
      {/* TOAST */}
      <Toast toast={toast} />

      {/* LEFT IMAGE */}
      <motion.div
        className="hidden lg:flex w-1/2 relative"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#410D1D]/90 to-transparent" />
      </motion.div>

      {/* LOGIN CARD */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          <h1
            className="text-center text-3xl sm:text-4xl tracking-widest mb-1 uppercase"
            style={{ color: colors.gold, fontFamily: "Playfair Display" }}
          >
            SHREE AAKAR
          </h1>

          <p
            className="text-center text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mb-8"
            style={{ color: colors.lightGold }}
          >
            Colors | Culture | Creations
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* EMAIL */}
            <div className="border-b border-white/30 focus-within:border-[#C5A059]">
              <input
                type="email"
                placeholder="Email Address"
                {...register("email", { required: true })}
                className="w-full bg-transparent py-3 outline-none text-sm"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative border-b border-white/30 focus-within:border-[#C5A059]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: true })}
                className="w-full bg-transparent py-3 outline-none text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 text-white/60"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* BUTTON */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full py-3 font-bold tracking-widest text-sm disabled:opacity-60"
              style={{ backgroundColor: colors.gold, color: colors.maroon }}
            >
              {loading ? "AUTHENTICATING..." : "LOGIN"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
