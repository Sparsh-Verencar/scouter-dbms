"use client";

import FreelancerProfileCard from "@/components/FreelancerProfileCard";
import PortfolioForm from "@/components/PortfolioForm";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { user, loading } = useUser();
  const [portfolio, setPortfolio] = useState(null);
  const [portLoading, setPortLoading] = useState(true);

  // New state for job stats
  const [stats, setStats] = useState({
    totalApplied: 0,
    ongoing: 0,
    finished: 0,
  });

  // FETCH PORTFOLIO
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

  // FETCH JOB STATS
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

  if (loading || portLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Not logged in.
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <PortfolioForm onCreated={() => window.location.reload()} />
      </div>
    );
  }

  // Layout with card + stats
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row items-start justify-center gap-8 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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

      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-sm transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Your Stats
        </h2>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Total Applied:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.totalApplied}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Ongoing:</span>
          <span className="font-semibold text-yellow-500">{stats.ongoing}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Finished:</span>
          <span className="font-semibold text-green-500">{stats.finished}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
