export default function ReviewSection() {
  const reviews = [
    { name: "John Doe", comment: "Very responsive and professional." },
    { name: "Jane Smith", comment: "Good communication throughout project." },
  ];

  return (
    <div className="review-section">
      <h3>Freelancer Reviews</h3>
      {reviews.map((r, i) => (
        <div key={i} className="review-card">
          <strong>{r.name}</strong>
          <p>{r.comment}</p>
          <button>Assign Job</button>
        </div>
      ))}
    </div>
  );
}
