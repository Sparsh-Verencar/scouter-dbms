// src/components/ui/RecruiterProfile.jsx

export default function RecruiterProfile({ recruiter }) {
  return (
    <div className="recruiter-profile">
      <h2>Recruiter Profile</h2>
      {recruiter ? (
        <>
          <p><strong>Name:</strong> {recruiter.name}</p>
          <p><strong>Company:</strong> {recruiter.company}</p>
          <p><strong>Email:</strong> {recruiter.email}</p>
        </>
      ) : (
        <p>No recruiter data available.</p>
      )}
    </div>
  );
}
