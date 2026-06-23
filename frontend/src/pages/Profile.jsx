import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Save, Package, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateProfileAPI } from "../services/authService";

const Profile = () => {
  const { user, login } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showCurrPass, setShowCurrPass] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    password: "",
  });



  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (form.password && form.password.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name,
        email: form.email,
      };
      if (form.password) {
        payload.password = form.password;
        payload.currentPassword = form.currentPassword;
      }

      const updated = await updateProfileAPI(payload);
      login(updated);
      setSuccess("Profile updated successfully!");
      setForm((prev) => ({ ...prev, currentPassword: "", password: "" }));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };



  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-10">
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Account
          </p>
          <h1 className="font-display text-4xl font-bold">My Profile</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">

              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <p className="font-display font-bold text-lg">{user?.name}</p>
                <p className="text-zinc-400 text-sm">{user?.email}</p>
                {user?.role === "admin" && (
                  <span className="mt-2 text-xs bg-brand-500/10 text-brand-500 px-3 py-1 rounded-full font-semibold">
                    Admin
                  </span>
                )}
              </div>

              {/* Nav */}
              <div className="space-y-2">
                {[
                  { id: "profile", label: "Edit Profile", icon: User },
                  { id: "password", label: "Change Password", icon: Lock },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id);
                      setError("");
                      setSuccess("");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === id
                        ? "bg-brand-500 text-white"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}

                <Link
                  to="/orders"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                >
                  <Package size={16} />
                  My Orders
                  <ArrowRight size={14} className="ml-auto" />
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">

              {/* Success */}
              {success && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-600 text-sm font-medium">
                  ✅ {success}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* Edit Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="font-display text-xl font-bold mb-6">
                    Edit Profile
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Full Name</label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block">Email Address</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Your email"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className={`w-full btn-primary flex items-center justify-center gap-2 !py-3.5 ${
                        saving ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Change Password Tab */}
              {activeTab === "password" && (
                <div>
                  <h2 className="font-display text-xl font-bold mb-6">
                    Change Password
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Current Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          name="currentPassword"
                          type={showCurrPass ? "text" : "password"}
                          value={form.currentPassword}
                          onChange={handleChange}
                          placeholder="Enter current password"
                          className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrPass(!showCurrPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                        >
                          {showCurrPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block">New Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          name="password"
                          type={showPass ? "text" : "password"}
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Enter new password (min 6 chars)"
                          className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                        >
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className={`w-full btn-primary flex items-center justify-center gap-2 !py-3.5 ${
                        saving ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;