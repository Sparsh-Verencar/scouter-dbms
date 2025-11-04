"use client";
 
import { motion } from "motion/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { NewButton } from "@/components/ui/movingborder";
import React from "react";
export default function Home() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
      <div className="flex space-x-10 min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <NewButton borderRadius="1.75rem"
        className="bg-black dark:bg-slate-200 text-white text-xl font-semibold dark:text-white border-green-500 dark:border-yellow-300">
        Recruiter
      </NewButton>
      <NewButton borderRadius="1.75rem"
        className="bg-black dark:bg-slate-200 text-white text-xl font-semibold dark:text-white border-red-500 dark:border-yellow-300">
        Freelancer
      </NewButton>
    </div>
    </motion.div>
    </AuroraBackground>
  );
}
