import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const { token, learner } = await api.register(name.trim(), email.trim(), password);
      login(token, learner);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-5">
      <div
        className="w-full max-w-sm"
        style={{ animation: "slide-up-fade 0.5s ease-out both" }}
      >
        {/* Logo */}
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-black text-offwhite tracking-tight">
            {"<"}CodeLingo{"/>"}
          </h1>
          <p className="mt-2 font-body text-sm text-muted">
            Start your coding journey today
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-xl font-bold text-offwhite mb-6">
            Create your account 🚀
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">YOUR NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ada Lovelace"
                className="w-full rounded-xl border border-line bg-ink px-4 py-3 font-body text-sm text-offwhite placeholder:text-muted outline-none focus:border-xp transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-line bg-ink px-4 py-3 font-body text-sm text-offwhite placeholder:text-muted outline-none focus:border-xp transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-line bg-ink px-4 py-3 font-body text-sm text-offwhite placeholder:text-muted outline-none focus:border-xp transition-colors"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-2 font-body text-sm text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 font-display font-bold text-ink transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: "#58CC02", boxShadow: "0 0 20px #58CC0244" }}
            >
              {loading ? "Creating account…" : "Get Started"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-body text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-xp hover:underline">
            Log in
          </Link>
        </p>
        <Footer />
      </div>
    </div>
  );
}
