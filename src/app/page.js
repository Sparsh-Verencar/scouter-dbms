<<<<<<< HEAD
// export default function RecruiterPage() {
//   return (
//     <div style={{ padding: "40px", textAlign: "center" }}>
//       <h1>Recruiter Dashboard</h1>
//       <p>Welcome to the Recruiter Portal!</p>
//     </div>
//   );
// }



"use client";
import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import RecruiterProfile from "@/components/ui/RecruiterProfile";
import RecruiterForm from "@/components/ui/RecruiterForm";
import JobList from "@/components/ui/JobList";
import ReviewSection from "@/components/ui/ReviewSection";
import "@/styles/recruiter.css";

export default function RecruiterDashboard() {
  const [view, setView] = useState("home");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const recruiter = {
    name: "John Doe",
    company: "TechNova Pvt Ltd",
    description: "Innovative software solutions for tomorrow.",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
  };

  const addJob = (job) => {
    setJobs([
      ...jobs,
      {
        ...job,
        id: Date.now(),
        applicants: [
          { id: 1, name: "Alice", skills: "React, Node.js", reviews: "Excellent work" },
          { id: 2, name: "Bob", skills: "Python, Django", reviews: "Good problem solver" },
        ],
        remainingMembers: job.members,
        deadline: "2025-11-10",
      },
    ]);
    setView("jobs");
  };

  const assignJob = (jobId, freelancer) => {
    alert(`Assigned ${freelancer.name} to job ${jobId}. Email notification sent.`);
    setJobs(
      jobs.map((j) =>
        j.id === jobId ? { ...j, remainingMembers: j.remainingMembers - 1 } : j
      )
    );
  };

  return (
    <div className="dashboard-container">
      <Navbar setView={setView} />
      <div className="dashboard-content">
        <RecruiterProfile recruiter={recruiter} />
        <div className="dashboard-main">
          {view === "home" && (
            <div className="welcome">
              <h2>Welcome, {recruiter.name}!</h2>
              <p>Use the navigation above to list new jobs or manage your existing ones.</p>
            </div>
          )}
          {view === "list" && <RecruiterForm addJob={addJob} />}
          {view === "jobs" && (
            <JobList
              jobs={jobs}
              setSelectedJob={setSelectedJob}
              selectedJob={selectedJob}
              assignJob={assignJob}
            />
          )}
          {selectedJob && <ReviewSection job={selectedJob} assignJob={assignJob} />}
        </div>
      </div>
=======
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button>
        sparsh vaibhav balaji
      </Button>
      <ModeToggle/>
>>>>>>> df157b9c46580bc4251eecdda1723acaa1ed1b6a
    </div>
  );
}
