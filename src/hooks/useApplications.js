import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { subscribeToApplications } from "../services/applications.js";

export default function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return undefined;
    setLoading(true);
    const unsubscribe = subscribeToApplications(
      user.uid,
      (data) => {
        setApplications(data);
        setError("");
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Could not load applications.");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  return { applications, loading, error };
}