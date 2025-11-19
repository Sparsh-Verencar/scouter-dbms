"use client";
import { useState, useEffect, useMemo } from "react";

export default function CreateJobsPage() {
  const [form, setForm] = useState({
    title: "",
    _description: "",
    salary: "",
    location: "",
    category: "",
  });

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(""); // 🔍 Search state

  // Fetch recruiter-created jobs
  async function fetchJobs() {
    try {
      const res = await fetch("http://localhost:3001/api/jobs/getRecruiterJobs", {
        credentials: "include",
      });

      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/jobs/recCreateJobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message || "Job created!");

      setForm({
        title: "",
        _description: "",
        salary: "",
        location: "",
        category: "",
      });

      await fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Error creating job");
    }
  };

  // 🔍 Filter jobs based on search
  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;

    return jobs.filter((j) =>
      j.title.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.category.toLowerCase().includes(q) ||
      j._description.toLowerCase().includes(q) ||
      String(j.salary).includes(q)
    );
  }, [search, jobs]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-start justify-center p-6 gap-10">

      {/* FORM SIDE */}
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 text-center">
          Create Job
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Job Title */}
          <div>
            <label className="block mb-2 font-semibold">Job Title</label>
            <input
              name="title"
              value={form.title}
              placeholder="Enter job title"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-900"
              onChange={handleChange}
              required
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block mb-2 font-semibold">Job Description</label>
            <textarea
              name="_description"
              value={form._description}
              placeholder="Enter job description"
              rows={5}
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-900 resize-none"
              onChange={handleChange}
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block mb-2 font-semibold">Salary</label>
            <input
              name="salary"
              value={form.salary}
              placeholder="50000"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-900"
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 font-semibold">Location</label>
            <input
              name="location"
              value={form.location}
              placeholder="City, State or Remote"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-900"
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-semibold">Category</label>
            <input
              name="category"
              value={form.category}
              placeholder="Engineering, Marketing, etc"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-900"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition"
          >
            Create Job
          </button>
        </form>
      </div>

      {/* JOB LIST SIDE */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-bold mb-4">Your Created Jobs</h2>

        {/* 🔍 Search Bar */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search created jobs..."
          className="w-full mb-4 p-3 rounded-xl border bg-gray-50 dark:bg-gray-900"
        />

        {filteredJobs.length === 0 ? (
          <p className="text-gray-500">No matching jobs found.</p>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.job_id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow border">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-500">{job.location}</p>
                <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                  {job._description}
                </p>
                <p className="text-sm text-gray-400 mt-1">Category: {job.category}</p>
                <p className="text-sm text-gray-400">Salary: {job.salary}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
