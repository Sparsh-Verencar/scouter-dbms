"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important!
        body: JSON.stringify({ password: pwd }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "Incorrect password.");
        return;
      }

      // store admin flag (frontend check)
      localStorage.setItem("isAdmin", "true");

      router.push("/admin");
    } catch (err) {
      console.error("Admin login failed", err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Enter admin password to proceed
            </h1>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-6">
            <Input
              type="password"
              required
              id="pwd"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="input sz-md variant-mixed"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
