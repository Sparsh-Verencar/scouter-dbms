"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Loader2, CheckCircle } from "lucide-react";
import { useRecruiter } from "@/hooks/useRecruiter";

const RecruiterProfilePage = () => {
    const { user, loading } = useRecruiter();
  
  // Temporary job statistics
  const jobStats = {
    created: 317,
    ongoing: 45,
    completed: 228,
  };

  if (loading) {
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
  // Job cards data
  const jobCards = [
    {
      title: "TOTAL CREATED JOBS",
      value: jobStats.created,
      lightColor: "from-amber-300 to-amber-400",
      darkColor: "from-yellow-600/70 to-yellow-800/60",
      icon: <PlusCircle size={32} />,
      link: "/recruiter-dashboard/jobs/create-jobs",
    },
    {
      title: "TOTAL ONGOING JOBS",
      value: jobStats.ongoing,
      lightColor: "from-sky-300 to-sky-400",
      darkColor: "from-blue-600/70 to-blue-800/60",
      icon: <Loader2 size={32} className="animate-spin-slow" />,
      link: "/recruiter-dashboard/jobs/ongoing-jobs",
    },
    {
      title: "COMPLETED JOBS",
      value: jobStats.completed,
      lightColor: "from-emerald-300 to-emerald-400",
      darkColor: "from-green-600/70 to-green-800/60",
      icon: <CheckCircle size={32} />,
      link: "/recruiter-dashboard/jobs/completed-jobs",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-10 p-8">
      {/* 🔥 STATUS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
        {jobCards.map((item, index) => (
          <div
            key={index}
            className={`
              p-6 rounded-3xl shadow-xl
              bg-gradient-to-br ${item.lightColor} dark:${item.darkColor}
              text-white backdrop-blur-xl
              transition-all duration-300
              hover:-translate-y-2 hover:shadow-2xl hover:brightness-110
              min-h-[190px]
              flex flex-col justify-between
            `}
          >
            {/* Title + Icon */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <div className="opacity-90">{item.icon}</div>
            </div>

            {/* Number */}
            <p className="text-5xl font-extrabold mt-3">{item.value}</p>

            {/* View link */}
            <button
              onClick={() => (window.location.href = item.link)}
              className="text-sm font-semibold underline underline-offset-4 mt-4 self-end hover:opacity-80"
            >
              View →
            </button>
          </div>
        ))}
      </div>

      {/* 🔽 PROFILE CARD */}
      <div
        className="
          w-full max-w-2xl p-10 rounded-3xl shadow-2xl
          bg-white/10 dark:bg-gray-800/40
          backdrop-blur-2xl border border-white/20 dark:border-gray-700/30
          text-black dark:text-gray-200
          transition-all duration-300
          hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        "
      >
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative">
            <img
              src="/noProfileImage.jpg"
              alt="Recruiter Avatar"
              className="w-40 h-40 rounded-full border-4 border-white/30 shadow-xl"
            />
            <div className="absolute inset-0 rounded-full ring-4 ring-purple-400/40 blur-sm"></div>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-extrabold mt-6 tracking-wide">
            {user.full_name}
          </h1>

          {/* Company */}
          <p className="text-gray-600 dark:text-gray-300 text-lg mt-1">
            {user.company_name}
          </p>

          {/* Contact Info */}
          <div className="mt-8 space-y-4 text-left w-full text-lg">
            <p className="flex justify-between">
              <strong>Email:</strong> <span>{user.email}</span>
            </p>
            <p className="flex justify-between">
              <strong>Phone:</strong> <span>{user.phone}</span>
            </p>
          </div>

          {/* Edit Button */}
          <button
            onClick={() =>
              (window.location.href = "/recruiter-dashboard/profile/edit")
            }
            className="
              mt-8 px-6 py-3 text-sm font-semibold rounded-xl
              bg-gradient-to-r from-purple-500 to-purple-700
              text-white shadow-lg
              transition-all duration-300
              hover:brightness-110 hover:shadow-purple-500/40
            "
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfilePage;
