"use client";
import FreelancerProfileCard from '@/components/FreelancerProfileCard';
import { useUser } from '@/hooks/useUser';
import React from 'react';

const ProfilePage = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl">
        Not logged in.
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[50vw] max-w-sm aspect-4/5 rounded-xl flex items-center justify-center">
        <FreelancerProfileCard 
          name={user.full_name}
          title={user.category}
          email={user.email}
          phone={user.phone}
          experience={user.experience}
          category={user.category}
          description="shakalaka boom boom"
          avatarUrl="/noProfileImage.jpg"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
