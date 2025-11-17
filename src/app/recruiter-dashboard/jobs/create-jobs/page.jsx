"use client";
import { useState } from "react";

export default function CreateJobsPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    category: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error creating job");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Create Job</h1>

      <form onSubmit={handleSubmit} className="grid gap-3 max-w-md">

        <input
          name="title"
          placeholder="Job Title"
          className="p-2 border rounded"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Job Description"
          className="p-2 border rounded"
          onChange={handleChange}
        />

        <input
          name="salary"
          placeholder="Salary"
          className="p-2 border rounded"
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          className="p-2 border rounded"
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          className="p-2 border rounded"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded"
        >
          Create Job
        </button>
      </form>
    </div>
  );
}
