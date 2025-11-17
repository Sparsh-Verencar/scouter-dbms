"use client";

import FreelancerProfileCard from "@/components/FreelancerProfileCard";
import PortfolioForm from "@/components/PortfolioForm";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { user, loading } = useUser();
  const [portfolio, setPortfolio] = useState(null);
  const [portLoading, setPortLoading] = useState(true);

  console.log("%c[ProfilePage] Render start", "color: yellow; font-weight: bold");
  console.log("%cUser:", "color: cyan", user);
  console.log("%cUser loading:", "color: cyan", loading);

  // FETCH PORTFOLIO
  useEffect(() => {
    console.log("%c[useEffect] User changed:", "color: orange", user);

    if (!user) {
      console.log("%cNo user → portfolio fetch skipped", "color: red");
      return;
    }

    async function fetchPortfolio() {
      console.log("%c[fetchPortfolio] Fetch started...", "color: purple");

      try {
        const res = await fetch("http://localhost:3001/api/portfolio/me", {
          method: "GET",
          credentials: "include",
        });

        console.log("%c[fetchPortfolio] Response status:", "color: purple", res.status);

        const data = await res.json();
        console.log("%c[fetchPortfolio] Response JSON:", "color: purple", data);

        setPortfolio(data.portfolio);
      } catch (err) {
        console.error("[fetchPortfolio] ERROR:", err);
      }

      setPortLoading(false);
      console.log("%c[fetchPortfolio] Loading complete", "color: purple");
    }

    fetchPortfolio();
  }, [user]);

  // Loading screen
  if (loading || portLoading) {
    console.log("%cShowing: Loading screen", "color: gray");
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    console.log("%cShowing: Not logged in screen", "color: red");
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Not logged in.
      </div>
    );
  }

  // No portfolio → show form
  if (!portfolio) {
    console.log("%cNo portfolio found → showing form", "color: lightgreen");
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <PortfolioForm onCreated={() => {
          console.log("%cPortfolio created → reloading page", "color: lightgreen");
          window.location.reload();
        }} />
      </div>
    );
  }

  // Portfolio exists → show card
  console.log("%cPortfolio FOUND → rendering profile card", "color: green", portfolio);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <FreelancerProfileCard
        name={user.full_name}
        title={portfolio.title}
        email={user.email}
        phone={user.phone}
        experience={user.experience}
        category={user.category}
        description={portfolio._description}
        avatarUrl="/noProfileImage.jpg"
      />
    </div>
  );
};

export default ProfilePage;
