// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function JobList() {
//   const [jobs, setJobs] = useState([]);
//   const [activeJob, setActiveJob] = useState(null);
 

//   // ⬇️ Move this function outside useEffect so it can be reused
//   async function fetchJobs() {
//     try {
//       const res = await fetch("http://localhost:3001/api/jobs/getFreeJobs");
//       const data = await res.json();
//       setJobs(data);
//     } catch (err) {
//       console.error("Error fetching jobs:", err);
//     }
//   }

//   // Fetch on page load
//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   // Apply handler
//   async function applyToJob(jobId) {
//     try {
//       const res = await fetch("http://localhost:3001/api/jobs/apply", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ job_id: jobId }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.error || "Application failed");
//         return;
//       }

//       alert("Application submitted!");
//       setActiveJob(null); // close modal

//       // ⬇️ NOW refresh the job list
//       await fetchJobs();
//     } catch (err) {
//       console.error("Apply error:", err);
//       alert("Something went wrong");
//     }
//   }

//   return (
//     <>
//       {/* Overlay */}
//       <AnimatePresence>
//         {activeJob && (
//           <motion.div
//             className="fixed inset-0 bg-black/40 z-40"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setActiveJob(null)}
//           />
//         )}
//       </AnimatePresence>

//       {/* Modal */}
//       <AnimatePresence>
//         {activeJob && (
//           <motion.div
//             className="fixed inset-0 flex items-center justify-center z-50 p-4"
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.8, opacity: 0 }}
//           >
//             <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full p-6 shadow-xl">
//               <h2 className="text-2xl font-bold mb-2">{activeJob.title}</h2>
//               <p className="text-neutral-500 mb-2">{activeJob.location}</p>

//               <p className="text-neutral-700 dark:text-neutral-300">
//                 {activeJob._description}
//               </p>

//               <button
//                 onClick={() => applyToJob(activeJob.job_id)}
//                 className="mt-6 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
//               >
//                 Apply Now
//               </button>

//               <button
//                 onClick={() => setActiveJob(null)}
//                 className="mt-3 w-full py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-700"
//               >
//                 Close
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Job List */}
//       <div className="max-w-2xl mx-auto mt-8 space-y-4">
//         {jobs.length === 0 && (
//           <p className="text-center text-neutral-500">No open positions.</p>
//         )}

//         {jobs.map((job) => (
//           <motion.div
//             key={job.job_id}
//             className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow hover:shadow-lg cursor-pointer"
//             onClick={() => setActiveJob(job)}
//             whileHover={{ scale: 1.02 }}
//           >
//             <h3 className="text-xl font-semibold">{job.title}</h3>
//             <p className="text-neutral-500">{job.location}</p>
//             <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
//               {job._description}
//             </p>
//           </motion.div>
//         ))}
//       </div>
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------------------------------------
   ✨ THEME (same as Portfolio page)
--------------------------------------------- */

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

/* ---------------------------------------------
   COMPONENT
--------------------------------------------- */

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);

  async function fetchJobs() {
    try {
      const res = await fetch("http://localhost:3001/api/jobs/getFreeJobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

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
      await fetchJobs();
    } catch (err) {
      console.error("Apply error:", err);
      alert("Something went wrong");
    }
  }

  return (
    <div className={pageBg}>
      <div className={headerBar}>Available Jobs</div>

      {/* Overlay */}
      <AnimatePresence>
        {activeJob && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
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
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
          >
            <div className={`${glowWrapper} max-w-lg w-full`}>
              <div className={innerCardStyle}>
                <h2 className="text-2xl font-bold">{activeJob.title}</h2>
                <p className="text-neutral-500 mb-4">{activeJob.location}</p>

                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {activeJob._description}
                </p>

                <button
                  onClick={() => applyToJob(activeJob.job_id)}
                  className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r 
                             from-blue-500 via-purple-500 to-pink-500 
                             text-white font-semibold shadow-lg hover:opacity-90 transition"
                >
                  Apply Now
                </button>

                <button
                  onClick={() => setActiveJob(null)}
                  className="mt-3 w-full py-2 rounded-xl bg-neutral-900 text-white 
                             dark:bg-neutral-700 hover:bg-neutral-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job List */}
      <div className="max-w-3xl mx-auto space-y-6">
        {jobs.length === 0 ? (
          <p className="text-center text-neutral-500 text-lg">
            No open positions.
          </p>
        ) : (
          jobs.map((job) => (
            <motion.div
              key={job.job_id}
              onClick={() => setActiveJob(job)}
              whileHover={{ scale: 1.02 }}
              className={glowWrapper}
            >
              <div className={innerCardStyle}>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-neutral-500 mt-1">{job.location}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
                  {job._description}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
