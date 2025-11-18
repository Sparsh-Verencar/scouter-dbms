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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 text-center">
          Create Job
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Job Title */}
          <div>
            <label
              htmlFor="title"
              className="block mb-2 font-semibold text-gray-800 dark:text-gray-300"
            >
              Job Title
            </label>
            <input
              id="title"
              name="title"
              placeholder="Enter job title"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
              onChange={handleChange}
              required
            />
          </div>

          {/* Job Description */}
          <div>
            <label
              htmlFor="description"
              className="block mb-2 font-semibold text-gray-800 dark:text-gray-300"
            >
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter detailed job description"
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
              onChange={handleChange}
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label
              htmlFor="salary"
              className="block mb-2 font-semibold text-gray-800 dark:text-gray-300"
            >
              Salary
            </label>
            <input
              id="salary"
              name="salary"
              placeholder="e.g. $60,000 - $80,000"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block mb-2 font-semibold text-gray-800 dark:text-gray-300"
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              placeholder="City, State, or Remote"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block mb-2 font-semibold text-gray-800 dark:text-gray-300"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              placeholder="e.g. Engineering, Marketing"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition duration-300"
          >
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
}
