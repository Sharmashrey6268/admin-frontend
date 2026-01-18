import { motion, AnimatePresence } from "framer-motion";

const styles = {
  success: {
    bg: "bg-[#C5A059]",
    text: "text-[#410D1D]",
  },
  error: {
    bg: "bg-red-600",
    text: "text-white",
  },
  info: {
    bg: "bg-[#410D1D]",
    text: "text-[#E8D4A2]",
  },
};

const Toast = ({ toast }) => {
  // 🔥 SAFETY CHECK
  if (!toast) return null;

  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md
            ${styles[toast.type]?.bg} ${styles[toast.type]?.text}`}
        >
          <p className="text-sm font-semibold tracking-wide">
            {toast.message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
