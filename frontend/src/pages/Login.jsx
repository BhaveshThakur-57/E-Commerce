import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      isLogin
        ? "Login — connect to backend!"
        : "Register — connect to backend!"
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent-400/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="font-display text-2xl font-bold gradient-text">
              NEXUS
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {isLogin
              ? "Sign in to your account to continue"
              : "Join thousands of happy shoppers"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl shadow-zinc-200/50 dark:shadow-black/30 border border-zinc-100 dark:border-zinc-800 animate-scale-in">
          {/* Tab Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 mb-8">
            {["Sign In", "Register"].map((label, i) => (
              <button
                key={label}
                onClick={() => setIsLogin(i === 0)}
                className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
                  i === 0 === isLogin
                    ? "bg-brand-500 text-white"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                />
              </div>
            )}
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
              />
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full btn-primary !rounded-xl !py-3.5 mt-2"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </div>

          {isLogin && (
            <p className="text-center text-sm text-zinc-400 mt-4">
              <a href="#" className="text-brand-500 hover:underline">
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