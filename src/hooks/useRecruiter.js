"use client";
import { useEffect, useState } from "react";

export function useRecruiter() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecruiter() {
      try {
        const res = await fetch("http://localhost:3001/api/auth/rec-me", {
          method: "GET",
          credentials: "include", // VERY IMPORTANT
        });

        if (!res.ok) {
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data.user); // { full_name, email, company_name, ... }
      } catch (err) {
        console.log("Recruiter fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecruiter();
  }, []);

  return { user, loading };
}
