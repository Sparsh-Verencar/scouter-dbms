// "use client";

// import FreelancerProfileCard from "@/components/FreelancerProfileCard";
// import PortfolioForm from "@/components/PortfolioForm";
// import { useUser } from "@/hooks/useUser";
// import { useEffect, useState } from "react";

// const ProfilePage = () => {
//   const { user, loading } = useUser();
//   const [portfolio, setPortfolio] = useState(null);
//   const [portLoading, setPortLoading] = useState(true);

//   // New state for job stats
//   const [stats, setStats] = useState({
//     totalApplied: 0,
//     ongoing: 0,
//     finished: 0,
//   });

//   // FETCH PORTFOLIO
//   useEffect(() => {
//     if (!user) return;

//     async function fetchPortfolio() {
//       try {
//         const res = await fetch("http://localhost:3001/api/portfolio/me", {
//           method: "GET",
//           credentials: "include",
//         });
//         const data = await res.json();
//         setPortfolio(data.portfolio);
//       } catch (err) {
//         console.error("[fetchPortfolio] ERROR:", err);
//       }
//       setPortLoading(false);
//     }

//     fetchPortfolio();
//   }, [user]);

//   // FETCH JOB STATS
//   useEffect(() => {
//     if (!user) return;

//     async function fetchStats() {
//       try {
//         const res = await fetch("http://localhost:3001/api/jobs/myStats", {
//           method: "GET",
//           credentials: "include",
//         });
//         const data = await res.json();
//         setStats({
//           totalApplied: data.totalApplied || 0,
//           ongoing: data.ongoing || 0,
//           finished: data.finished || 0,
//         });
//       } catch (err) {
//         console.error("[fetchStats] ERROR:", err);
//       }
//     }

//     fetchStats();
//   }, [user]);

//   if (loading || portLoading) {
//     return (
//       <div className="w-full h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="w-full h-screen flex items-center justify-center">
//         Not logged in.
//       </div>
//     );
//   }

//   if (!portfolio) {
//     return (
//       <div className="w-full h-screen flex items-center justify-center">
//         <PortfolioForm onCreated={() => window.location.reload()} />
//       </div>
//     );
//   }

//   // Layout with card + stats
//   return (
//     <div className="w-full min-h-screen flex flex-col md:flex-row items-start justify-center gap-8 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//       <FreelancerProfileCard
//         name={user.full_name}
//         title={portfolio.title}
//         email={user.email}
//         phone={user.phone}
//         experience={user.experience}
//         category={user.category}
//         description={portfolio._description}
//         avatarUrl="/noProfileImage.jpg"
//       />

//       <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-sm transition-colors duration-300">
//         <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
//           Your Stats
//         </h2>

//         <div className="flex justify-between items-center">
//           <span className="text-gray-700 dark:text-gray-300">Total Applied:</span>
//           <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.totalApplied}</span>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-gray-700 dark:text-gray-300">Ongoing:</span>
//           <span className="font-semibold text-yellow-500">{stats.ongoing}</span>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-gray-700 dark:text-gray-300">Finished:</span>
//           <span className="font-semibold text-green-500">{stats.finished}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


"use client";

import FreelancerProfileCard from "@/components/FreelancerProfileCard";
import PortfolioForm from "@/components/PortfolioForm";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

/* ---------------------------------------------
   🔥 VISUAL STYLES
--------------------------------------------- */

const glowWrapper = `
  w-full relative rounded-3xl p-[2px]
  bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
  shadow-[0_0_25px_rgba(99,102,241,0.4)]
  transition-all duration-500
  hover:shadow-[0_0_45px_rgba(168,85,247,0.7)]
  hover:scale-[1.02]
  hover:rotate-[0.3deg]
`;

const innerCardStyle = `
  w-full h-full rounded-3xl p-6
  bg-white/90 dark:bg-gray-900/80
  backdrop-blur-2xl shadow-xl
  transition-all duration-500
  hover:shadow-2xl
`;

/* 🎨 Background gradient behind everything */
const pageBg = `
  bg-gradient-to-br from-gray-100 via-white to-gray-200
  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
  transition-all duration-500
`;

/* 🌈 Glowing Header Bar */
const headerBar = `
  w-full py-6 text-center text-3xl font-bold tracking-wide 
  bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
  bg-clip-text text-transparent
  drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]
`;


const ProfilePage = () => {
  const { user, loading } = useUser();
  const [portfolio, setPortfolio] = useState(null);
  const [portLoading, setPortLoading] = useState(true);

  const [stats, setStats] = useState({
    totalApplied: 0,
    ongoing: 0,
    finished: 0,
  });

  /* ---------------------------------------------
     FETCH PORTFOLIO
  --------------------------------------------- */
  useEffect(() => {
    if (!user) return;

    async function fetchPortfolio() {
      try {
        const res = await fetch("http://localhost:3001/api/portfolio/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setPortfolio(data.portfolio);
      } catch (err) {
        console.error("[fetchPortfolio] ERROR:", err);
      }
      setPortLoading(false);
    }

    fetchPortfolio();
  }, [user]);

  /* ---------------------------------------------
     FETCH STATS
  --------------------------------------------- */
  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:3001/api/jobs/myStats", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        setStats({
          totalApplied: data.totalApplied || 0,
          ongoing: data.ongoing || 0,
          finished: data.finished || 0,
        });
      } catch (err) {
        console.error("[fetchStats] ERROR:", err);
      }
    }

    fetchStats();
  }, [user]);

  /* ---------------------------------------------
     STATES
  --------------------------------------------- */

  if (loading || portLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg">
        Not logged in.
      </div>
    );
  }

  /* ---------------------------------------------
     NO PORTFOLIO → Create Form
  --------------------------------------------- */

  if (!portfolio) {
    return (
      <div className={`w-full min-h-screen flex flex-col items-center px-4 py-10 ${pageBg}`}>
        <div className={headerBar}>Create Your Portfolio</div>

        <div className={`${glowWrapper} max-w-xl mt-10`}>
          <div className={innerCardStyle}>
            <PortfolioForm onCreated={() => window.location.reload()} />
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     MAIN PROFILE PAGE
  --------------------------------------------- */

  return (
    <div className={`w-full min-h-screen flex flex-col items-center px-6 py-12 ${pageBg}`}>

      {/* 🔥 Glowing Header */}
      <div className={headerBar}>Your Profile</div>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10 w-full max-w-6xl mt-12">

        {/* 🌈 PROFILE CARD */}
        <div className={`${glowWrapper} max-w-lg`}>
          <div className={innerCardStyle}>
            <FreelancerProfileCard
              name={user.full_name}
              title={portfolio.title}
              email={user.email}
              phone={user.phone}
              experience={user.experience}
              category={user.category}
              description={portfolio._description}
              avatarUrl="/noProfileImage.jpg"
            />
          </div>
        </div>

        {/* 🌈 STATS CARD */}
        <div className={`${glowWrapper} max-w-sm`}>
          <div className={innerCardStyle}>
            <CardHeader>
              <h2 className="text-2xl font-bold">Your Stats</h2>
            </CardHeader>

            <CardContent className="space-y-4 mt-2">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600 dark:text-gray-300">Total Applied:</span>
                <span className="font-semibold">{stats.totalApplied}</span>
              </div>

              <div className="flex justify-between text-lg">
                <span className="text-gray-600 dark:text-gray-300">Ongoing:</span>
                <span className="font-semibold text-yellow-500">{stats.ongoing}</span>
              </div>

              <div className="flex justify-between text-lg">
                <span className="text-gray-600 dark:text-gray-300">Finished:</span>
                <span className="font-semibold text-green-500">{stats.finished}</span>
              </div>
            </CardContent>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
