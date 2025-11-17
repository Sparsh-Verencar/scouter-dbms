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
      className="w-[400px] p-6 bg-white shadow rounded-xl space-y-4"
    >
      <h2 className="text-xl font-semibold">Create Your Portfolio</h2>

      <input
        className="w-full p-2 border rounded"
        placeholder="Your role/title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />

      <textarea
        className="w-full p-2 border rounded"
        placeholder="Describe yourself..."
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />

      <button className="w-full bg-black text-white py-2 rounded">
        Save Portfolio
      </button>
    </form>
  );
}
