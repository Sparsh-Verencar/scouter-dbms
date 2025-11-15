"use client"
import FreelancerProfileCard from '@/components/FreelancerProfileCard';
import React from 'react'

const ProfilePage = () => {
  return (
  <div className='w-full h-screen flex items-center justify-center'>
    <div className="w-[50vw] max-w-sm aspect-4/5 rounded-xl flex items-center justify-center 
">
  <FreelancerProfileCard
/>

    </div>
  </div>
);

}

export default ProfilePage