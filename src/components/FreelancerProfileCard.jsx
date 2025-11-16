export default function FreelancerProfileCard({
  name = "sammy",
  title = "swe",
  email = "email",
  phone = 676767,
  experience = 1,
  category =" ai/ml",
  description = "shakalaka boom boom",
  avatarUrl = "/noProfileImage.jpg"
}) {
  return (
    <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-300 dark:border-gray-700">
      {/* Avatar */}
      <div className="w-full flex justify-center">
        <img
          src={avatarUrl}
          alt={`${name} avatar`}
          className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* Name + Title */}
      <h2 className="text-2xl font-semibold text-center mt-4">{name}</h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
        {title}
      </p>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

      {/* Info Section */}
      <div className="space-y-2 text-sm">
        <p><span className="font-medium">Email:</span> {email}</p>
        <p><span className="font-medium">Phone:</span> {phone}</p>
        <p><span className="font-medium">Experience:</span> {experience} years</p>
        <p><span className="font-medium">Category:</span> {category}</p>
      </div>

      {/* Description */}
      {description && (
        <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
