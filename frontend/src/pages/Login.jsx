import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { loginAPI, registerAPI } from "../services/authService";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await loginAPI(form.email, form.password);
      } else {
        if (!form.name.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }
        data = await registerAPI(form.name, form.email, form.password);
      }
      login(data);
      
      // Role-based redirect
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-200 dark:border-zinc-800">
        
        {/* Left Side - Image/Animation */}
        <div className="w-full md:w-1/2 relative hidden md:block group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=80" 
            alt="Fashion Model" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 text-white">
            <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Wear the <br/><span className="text-brand-400">Extraordinary.</span>
            </h2>
            <p className="text-zinc-300 text-lg max-w-sm leading-relaxed mb-4">
              Join LUXORA today to access premium streetwear collections, exclusive drops, and a personalized fashion experience.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                LUXORA
              </span>
            </Link>
            <h1 className="font-display text-3xl font-bold mb-2 text-zinc-900 dark:text-white">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              {isLogin
                ? "Sign in to your account to continue"
                : "Join thousands of happy shoppers"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 mb-8 bg-zinc-100 dark:bg-zinc-950 p-1">
            {["Sign In", "Register"].map((label, i) => (
              <button
                key={label}
                onClick={() => { setIsLogin(i === 0); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  (i === 0) === isLogin
                    ? "bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center font-medium animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {!isLogin && (
              <div className="relative animate-fade-in">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 focus:ring-1 focus:ring-brand-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl py-4 mt-4 flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-brand-500/25 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  {isLogin ? "Sign In to Account" : "Create Account"} <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {isLogin && (
            <p className="text-center text-sm text-zinc-400 mt-6">
              <a href="#" className="text-brand-500 hover:text-brand-400 font-medium transition-colors">
                Forgot password?
              </a>
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;