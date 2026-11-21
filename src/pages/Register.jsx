import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthShell, { authErrorMessage } from "../components/AuthShell.jsx";

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.email.trim()) return setError("Please enter your email.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking your applications in one place."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
          <input id="name" name="name" autoComplete="name" value={form.name} onChange={set} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={set} className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={set} className={inputClass} />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-slate-700">Confirm password</label>
          <input id="confirm" name="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set} className={inputClass} />
        </div>
        {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Register"}
        </button>
      </form>
    </AuthShell>
  );
}