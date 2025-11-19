"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------------------
   ✨ THEME
-------------------------------------------------- */

const glowWrapper = `
  relative rounded-3xl p-[2px]
  bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
  shadow-[0_0_25px_rgba(99,102,241,0.4)]
  transition-all duration-500
  hover:shadow-[0_0_45px_rgba(168,85,247,0.7)]
  hover:scale-[1.02]
`;

const innerCardStyle = `
  w-full h-full rounded-3xl p-6
  bg-white/90 dark:bg-gray-900/80
  backdrop-blur-2xl shadow-xl
  transition-all duration-500
  hover:shadow-2xl
`;

const pageBg = `
  bg-gradient-to-br from-gray-100 via-white to-gray-200
  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
  min-h-screen pt-12 px-6
`;

const headerBar = `
  w-full text-center text-3xl font-bold tracking-wide mb-10
  bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
  bg-clip-text text-transparent
  drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]
`;

/* -------------------------------------------------
   COMPONENT
-------------------------------------------------- */

export default function CompletedJobs() {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [search, setSearch] = useState("");

  async function fetchJobs() {
    try {
      const res = await fetch("http://localhost:3001/api/jobs/getCompletedJobs", {
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Error response:", errData);
        return;
      }

      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching completed jobs:", err);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  /* -------------------------------------------------
     🔍 SEARCH — FILTER LOGIC
  -------------------------------------------------- */

  const filteredJobs = jobs.filter((job) => {
    const term = search.toLowerCase();

    return (
      job.title.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term) ||
      job._description.toLowerCase().includes(term) ||
      (job.submission_link && job.submission_link.toLowerCase().includes(term))
    );
  });

  return (
    <div className={pageBg}>
      <div className={headerBar}>Completed Jobs</div>

      {/* 🔍 Search Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search completed jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-xl border shadow-md text-lg 
                     dark:bg-neutral-800 dark:text-white"
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {filteredJobs.length === 0 && (
          <p className="text-center text-neutral-500 text-lg">
            No completed jobs found.
          </p>
        )}

        {filteredJobs.map((job) => (
          <motion.div
            key={job.job_id}
            className={glowWrapper}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveJob(job)}
          >
            <div className={innerCardStyle}>
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-neutral-500 mt-1">{job.location}</p>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
                {job._description}
              </p>

              {job.submission_link && (
                <p className="text-blue-600 mt-2 text-sm underline">
                  Submitted link: {job.submission_link}
                </p>
              )}

              <p className="mt-4 text-green-600 font-semibold">
                Completed at: {new Date(job.completed_at).toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeJob && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveJob(null)}
          >
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${glowWrapper} max-w-lg w-full`}>
                <div className={innerCardStyle}>
                  <h2 className="text-2xl font-bold">{activeJob.title}</h2>
                  <p className="text-neutral-500 mb-3">{activeJob.location}</p>

                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {activeJob._description}
                  </p>

                  {activeJob.submission_link && (
                    <p className="mt-3 text-blue-600 underline break-all">
                      Submission Link: {activeJob.submission_link}
                    </p>
                  )}

                  <p className="mt-4 text-green-600 font-semibold">
                    Completed at:{" "}
                    {new Date(activeJob.completed_at).toLocaleString()}
                  </p>

                  <button
                    onClick={() => setActiveJob(null)}
                    className="
                      mt-6 w-full py-3 rounded-xl
                      bg-neutral-900 text-white dark:bg-neutral-700
                      hover:bg-neutral-800 transition
                    "
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
