import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", profilePic: "" });
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const endpoint = isLogin ? "login" : "signup";
    let res;

    if (isLogin) {
      // ---- LOGIN (JSON) ----
      res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
    } else {
      // ---- SIGNUP (FormData for file upload) ----
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (form.profilePic) formData.append("avatar", form.profilePic); // matches backend upload.single('avatar')

      res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        body: formData,
      });
    }

    const data = await res.json();

    if (res.ok) {
      if (isLogin) {
        login(data.token);
        navigate("/dashboard");
      } else {
        alert("Signup successful! Please log in.");
        setIsLogin(true);
      }
    } else {
      alert(data.msg || data.message || "Something went wrong.");
    }
  } catch (err) {
    console.error(err);
    alert("Server error. Check your backend connection.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 to-white">
      {/* Left Side - Form */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-600 text-center mb-6">
            {isLogin ? "Welcome Back 👋" : "Create an Account 🪄"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            {!isLogin && (
             <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, profilePic: e.target.files[0] })}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
             />
            )}


            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition-all duration-300"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </motion.button>
          </form>

          <p className="text-center mt-4 text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:underline font-medium"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </motion.div>

      {/* Right Side - Website Info + Animated Charts */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="flex-1 flex flex-col justify-center items-center text-center bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white p-10 relative overflow-hidden"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold mb-2"
        >
          Expense Tracker Pro
        </motion.h2>
        <p className="max-w-md mb-6 text-indigo-100">
          Track your expenses, visualize your progress, and manage your money
          smarter. All your finances in one beautiful dashboard.
        </p>

        {/* Animated Bar Chart */}
        <div className="relative flex gap-2 h-40 items-end">
          {[60, 80, 45, 70, 90, 55].map((height, i) => (
            <motion.div
              key={i}
              className="w-6 bg-white/80 rounded-t-md"
              initial={{ height }}
              animate={{ height: [height - 10, height + 20, height] }}
              transition={{
                repeat: Infinity,
                duration: 2 + i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Floating Circles */}
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-20 h-20 bg-indigo-400/40 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 w-28 h-28 bg-indigo-300/40 rounded-full blur-2xl"
        />
      </motion.div>
    </div>
  );
}
