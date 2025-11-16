"use client"

import Image from "next/image";

export default function FreelancerDashboard() {
  return (
   <div className="w-full h-full flex flex-col items-center justify-center">
  <Image
    src="/scouterLogo-removebg-preview.png"
    alt="scouter logo"
    width={200}   // original size
    height={200}  // original size
    className="w-1/3 max-w-xs h-auto" // responsive width, auto height
  />
  <h1 className="text-4xl dark:text-gray-600 text-gray-400 pt-10">
    START APPLYING
  </h1>
</div>

  );
}
