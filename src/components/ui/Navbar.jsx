export default function Navbar({ setSelectedTab }) {
  return (
    <nav className="navbar">
      <h2>Recruiter Dashboard</h2>
      <div className="nav-links">
        <button onClick={() => setSelectedTab("form")}>List Job</button>
        <button onClick={() => setSelectedTab("list")}>My Jobs</button>
        <button onClick={() => setSelectedTab("review")}>Reviews</button>
      </div>
    </nav>
  );
}
