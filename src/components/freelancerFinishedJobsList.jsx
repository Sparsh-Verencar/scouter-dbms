"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CompletedJobs() {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);

  // Fetch completed jobs for current freelancer
  async function fetchJobs() {
    try {
      console.log("Fetching completed jobs...");
      const res = await fetch("http://localhost:3001/api/jobs/getCompletedJobs", {
        credentials: "include", // send cookies for auth
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Error response:", errData);
        return;
      }

      const data = await res.json();
      console.log("Fetched completed jobs:", data);
      setJobs(data);
    } catch (err) {
      console.error("Error fetching completed jobs:", err);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  console.log("Current completed jobs state:", jobs);

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      {jobs.length === 0 && (
        <p className="text-center text-neutral-500">No completed jobs yet.</p>
      )}

      {jobs.map((job) => (
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
          <p className="mt-2 text-green-600 font-semibold">
            Completed at: {new Date(job.completed_at).toLocaleString()}
          </p>
        </motion.div>
      ))}

      {/* Modal for active job */}
      <AnimatePresence>
        {activeJob && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveJob(null)}
          >
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-2">{activeJob.title}</h2>
                <p className="text-neutral-500 mb-2">{activeJob.location}</p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  {activeJob._description}
                </p>
                <p className="mt-2 text-green-600 font-semibold">
                  Completed at: {new Date(activeJob.completed_at).toLocaleString()}
                </p>
                <button
                  onClick={() => setActiveJob(null)}
                  className="mt-3 w-full py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
