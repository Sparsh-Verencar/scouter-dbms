export default function JobList({ jobs }) {
  return (
    <div className="job-list">
      <h3>Jobs Listed</h3>
      {jobs.length === 0 ? (
        <p>No jobs listed yet.</p>
      ) : (
        <ul>
          {jobs.map((job, index) => (
            <li key={index}>
              <h4>{job.skill}</h4>
              <p>Members Needed: {job.members}</p>
              <p>Pay: {job.pay}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
