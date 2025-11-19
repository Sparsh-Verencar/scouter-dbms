"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function OngoingJobs() {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [search, setSearch] = useState("");

  async function fetchJobs() {
    try {
      const res = await fetch("http://localhost:3001/api/jobs/getFreeOngoing", {
        credentials: "include",
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching ongoing jobs:", err);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  async function finishJob(jobId, submissionLink) {
    try {
      const res = await fetch("http://localhost:3001/api/jobs/finishJob", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: jobId,
          submission_link: submissionLink,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to finish job");
        return;
      }

      alert("Job submitted successfully!");
      await fetchJobs();
    } catch (err) {
      console.error("Finish job error:", err);
      alert("Something went wrong!");
    }
  }

  // 🔍 FILTERED JOBS LIST
  const filteredJobs = jobs.filter((job) => {
    const term = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term) ||
      job._description.toLowerCase().includes(term)
    );
  });

  return (
    <div className={pageBg}>
      <h1 className={headerBar}>Your Ongoing Jobs</h1>

      {/* 🔍 SEARCH BAR */}
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search jobs by title, location or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-xl border shadow-md text-lg 
                     dark:bg-neutral-800 dark:text-white"
        />
      </div>

      <div className="max-w-2xl mx-auto mt-8 space-y-6">
        {filteredJobs.length === 0 && (
          <p className="text-center text-neutral-500">
            No jobs match your search.
          </p>
        )}

        {filteredJobs.map((job) => (
          <motion.div
            key={job.job_id}
            className={glowWrapper}
            whileHover={{ scale: 1.01 }}
            onClick={() => {
              setSubmissionLink("");
              setActiveJob(job);
            }}
          >
            <div className={innerCardStyle}>
              <h3 className="text-2xl font-semibold">{job.title}</h3>
              <p className="text-neutral-500">{job.location}</p>
              <p className="text-neutral-500">{job.salary}</p>
              <p className="text-neutral-700 dark:text-neutral-400 mt-2 line-clamp-2">
                {job._description}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSubmissionLink("");
                  setActiveJob(job);
                }}
                className="mt-4 py-2 px-5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                Finish
              </button>
            </div>
          </motion.div>
        ))}

        {/* Modal */}
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
                  <p className="text-neutral-500 mb-2">{activeJob.salary}</p>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                    {activeJob._description}
                  </p>

                  <input
                    type="text"
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    placeholder="Paste your submission link"
                    className="w-full p-3 border rounded-lg dark:bg-neutral-800 dark:text-white"
                  />

                  <button
                    onClick={() => {
                      if (!submissionLink.trim()) {
                        alert("Please enter a valid submission link.");
                        return;
                      }
                      finishJob(activeJob.job_id, submissionLink);
                      setActiveJob(null);
                    }}
                    className="mt-4 w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                  >
                    Submit & Finish Job
                  </button>

                  <button
                    onClick={() => setActiveJob(null)}
                    className="mt-3 w-full py-2 rounded-lg bg-neutral-800 text-white dark:bg-neutral-700"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
