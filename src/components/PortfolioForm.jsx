"use client";
import { useState } from "react";

export default function PortfolioForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/portfolio/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        onCreated();
        setTitle("");
        setDescription("");
      } else {
        console.log("Error creating portfolio", data);
      }
    } catch (err) {
      console.error("[PortfolioForm] Fetch ERROR:", err);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl space-y-4 transition-colors duration-300"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Create Your Portfolio
      </h2>

      <input
        type="text"
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Your role/title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Describe yourself..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Save Portfolio
      </button>
    </form>
  );
}
