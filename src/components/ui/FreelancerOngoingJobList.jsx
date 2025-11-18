// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function OngoingJobs() {
//   const [jobs, setJobs] = useState([]);
//   const [activeJob, setActiveJob] = useState(null);

//   // Fetch ongoing jobs
//   async function fetchJobs() {
//     try {
//       console.log("Fetching ongoing jobs...");
//       const res = await fetch("http://localhost:3001/api/jobs/getFreeOngoing", {
//         credentials: "include",
//       });

//       console.log("Raw response:", res);
//       const data = await res.json();
//       console.log("Fetched jobs:", data);

//       setJobs(data);
//     } catch (err) {
//       console.error("Error fetching ongoing jobs:", err);
//     }
//   }

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   // Mark job as finished
//   async function finishJob(jobId) {
//     try {
//       console.log("Finishing job:", jobId);
//       const res = await fetch("http://localhost:3001/api/jobs/finishJob", {
//         method: "PUT",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ job_id: jobId }),
//       });

//       const data = await res.json();
//       console.log("Finish job response:", data);

//       if (!res.ok) {
//         alert(data.error || "Failed to finish job");
//         return;
//       }

//       alert("Job marked as completed!");
//       await fetchJobs(); // refresh list
//     } catch (err) {
//       console.error("Finish job error:", err);
//       alert("Something went wrong");
//     }
//   }

//   console.log("Current jobs state:", jobs);

//   return (
//     <div className="max-w-2xl mx-auto mt-8 space-y-4">
//       {jobs.length === 0 && (
//         <p className="text-center text-neutral-500">No ongoing jobs.</p>
//       )}

//       {jobs.map((job) => (
//         <motion.div
//           key={job.job_id}
//           className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow hover:shadow-lg cursor-pointer"
//           whileHover={{ scale: 1.02 }}
//           onClick={() => setActiveJob(job)}
//         >
//           <h3 className="text-xl font-semibold">{job.title}</h3>
//           <p className="text-neutral-500">{job.location}</p>
//           <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
//             {job._description}
//           </p>

//           <button
//             onClick={(e) => {
//               e.stopPropagation(); // prevent card click
//               finishJob(job.job_id);
//             }}
//             className="mt-3 py-2 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
//           >
//             Finish
//           </button>
//         </motion.div>
//       ))}

//       {/* Modal for active job */}
//       <AnimatePresence>
//         {activeJob && (
//           <motion.div
//             className="fixed inset-0 bg-black/40 z-40"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setActiveJob(null)}
//           >
//             <motion.div
//               className="fixed inset-0 flex items-center justify-center z-50 p-4"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full p-6 shadow-xl">
//                 <h2 className="text-2xl font-bold mb-2">{activeJob.title}</h2>
//                 <p className="text-neutral-500 mb-2">{activeJob.location}</p>
//                 <p className="text-neutral-700 dark:text-neutral-300">
//                   {activeJob._description}
//                 </p>
//                 <button
//                   onClick={() => finishJob(activeJob.job_id)}
//                   className="mt-6 w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
//                 >
//                   Finish Job
//                 </button>
//                 <button
//                   onClick={() => setActiveJob(null)}
//                   className="mt-3 w-full py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-700"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------------------
   ✨ THEME — matches Portfolio/Projects/Profile
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

export default function OngoingJobs() {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);

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

  async function finishJob(jobId) {
    try {
      const res = await fetch("http://localhost:3001/api/jobs/finishJob", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to finish job");
        return;
      }

      alert("Job marked as completed!");
      await fetchJobs();
    } catch (err) {
      console.error("Finish job error:", err);
      alert("Something went wrong");
    }
  }

  return (
    <div className={pageBg}>
      <div className={headerBar}>Ongoing Jobs</div>

      <div className="max-w-3xl mx-auto space-y-6">
        {jobs.length === 0 && (
          <p className="text-center text-neutral-500 text-lg">
            No ongoing jobs.
          </p>
        )}

        {jobs.map((job) => (
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

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  finishJob(job.job_id);
                }}
                className="
                  mt-4 py-2 px-4 w-full rounded-xl
                  bg-green-600 text-white font-semibold
                  hover:bg-green-700 transition
                "
              >
                Finish Job
              </button>
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

                  <button
                    onClick={() => finishJob(activeJob.job_id)}
                    className="
                      mt-6 w-full py-3 rounded-xl
                      bg-green-600 text-white font-semibold
                      hover:bg-green-700 transition
                    "
                  >
                    Finish Job
                  </button>

                  <button
                    onClick={() => setActiveJob(null)}
                    className="
                      mt-3 w-full py-2 rounded-xl
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
