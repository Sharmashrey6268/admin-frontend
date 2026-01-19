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

      // ✅ SAVE TOKEN + LOGIN TIME
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("loginTime", Date.now());

      showToast("success", "Login successful");

      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 700);
    } catch (err) {
      showToast("error", "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex text-white"
      style={{ backgroundColor: colors.maroon }}
    >
      <Toast toast={toast} />

      {/* LEFT IMAGE */}
      <motion.div
        className="hidden lg:flex w-1/2 relative"
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
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
        <motion.div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1
            className="text-center text-3xl tracking-widest mb-6 uppercase"
            style={{ color: colors.gold }}
          >
            SHREE AAKAR
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
              className="w-full bg-transparent border-b py-3 outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: true })}
                className="w-full bg-transparent border-b py-3 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold tracking-widest disabled:opacity-60"
              style={{ backgroundColor: colors.gold, color: colors.maroon }}
            >
              {loading ? "AUTHENTICATING..." : "LOGIN"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
