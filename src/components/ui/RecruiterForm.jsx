import React, { useState } from "react";

export default function RecruiterForm({ addJob }) {
  const [job, setJob] = useState({ skill: "", members: "", pay: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    addJob(job);
    setJob({ skill: "", members: "", pay: "" });
  };

  return (
    <form className="recruiter-form" onSubmit={handleSubmit}>
      <h3>Post a New Job</h3>
      <input
        type="text"
        placeholder="Required Skill"
        value={job.skill}
        onChange={(e) => setJob({ ...job, skill: e.target.value })}
      />
      <input
        type="number"
        placeholder="Members Needed"
        value={job.members}
        onChange={(e) => setJob({ ...job, members: e.target.value })}
      />
      <input
        type="text"
        placeholder="Pay per member"
        value={job.pay}
        onChange={(e) => setJob({ ...job, pay: e.target.value })}
      />
      <button type="submit">Add Job</button>
    </form>
  );
}
