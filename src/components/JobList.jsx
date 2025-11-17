"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);

  // Fetch jobs from express backend
  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("http://localhost:3001/api/jobs/getFreeJobs");
        const data = await res.json();
        console.log("Jobs fetched:", data);
        // Backend should already return only Open + Unassigned
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    }

    fetchJobs();
  }, []);

  return (
    <>
      {/* Overlay for active card */}
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

      {/* Expanded Job Card */}
      <AnimatePresence>
        {activeJob && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">{activeJob.title}</h2>
              <p className="text-neutral-500 mb-2">{activeJob.location}</p>
              <p className="text-neutral-700 dark:text-neutral-300">
                {activeJob._description}
              </p>

              <button
                onClick={() => setActiveJob(null)}
                className="mt-6 w-full py-2 rounded-lg bg-black text-white"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List of Open Jobs */}
      <div className="max-w-2xl mx-auto mt-8 space-y-4">
        {jobs.length === 0 && (
          <p className="text-center text-neutral-500">No open positions.</p>
        )}

        {jobs.map(job => (
          <motion.div
            key={job.job_id}
            className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow hover:shadow-lg cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveJob(job)}
          >
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-neutral-500">{job.location}</p>
            <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
              {job._description}
            </p>
          </motion.div>
        ))}
      </div>
    </>
  );
}
