"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
 


  // Fetch Jobs
  async function fetchJobs() {
    try {
      const res = await fetch("http://localhost:3001/api/jobs/getFreeJobs", {
        credentials: "include",
      });

      const data = await res.json();
      console.log(data)
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply to job
  async function applyToJob(jobId) {
    try {
      const res = await fetch("http://localhost:3001/api/jobs/apply", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Application failed");
        return;
      }

      alert("Application submitted!");
      setActiveJob(null);

      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {activeJob && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveJob(null)}
          />
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {activeJob && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="bg-white dark:bg-neutral-900 w-full max-w-lg p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold">{activeJob.title}</h2>
              <p className="text-neutral-500">{activeJob.location}</p>

              <p className="text-neutral-700 dark:text-neutral-300 mt-3">
                {activeJob._description}
              </p>

              <button
                onClick={() => applyToJob(activeJob.job_id)}
                className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Apply Now
              </button>

              <button
                onClick={() => setActiveJob(null)}
                className="w-full mt-3 py-2 bg-neutral-900 dark:bg-neutral-700 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job List */}
      <div className="max-w-2xl mx-auto mt-8 space-y-4">
        {jobs.length === 0 && (
          <p className="text-center text-neutral-500">No open positions.</p>
        )}

        {jobs.map((job) => (
          <motion.div
            key={job.job_id}
            className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow hover:shadow-lg cursor-pointer"
            onClick={() => setActiveJob(job)}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-neutral-500">{job.location}</p>

            <p className="text-neutral-600 text-sm line-clamp-2 mt-1">
              {job._description}
            </p>
          </motion.div>
        ))}
      </div>
    </>
  );
}
