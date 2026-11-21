import { isFirebaseConfigured } from "../firebase.js";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-600">InternTrack</h1>
          <p className="mt-1 text-sm text-slate-500">Internship &amp; Job Application Manager</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 mb-5 text-sm text-slate-500">{subtitle}</p>
          {!isFirebaseConfigured && (
            <div className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800" role="alert">
              Firebase is not configured yet. Copy <code>.env.example</code> to <code>.env</code> and add your
              Firebase keys, then restart the dev server.
            </div>
          )}
          {children}
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">{footer}</p>
      </div>
    </div>
  );
}

export function authErrorMessage(err) {
  switch (err?.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return err?.message || "Something went wrong. Please try again.";
  }
}