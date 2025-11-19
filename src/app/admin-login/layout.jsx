"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (isAdmin !== "true") {
      router.replace("/admin-login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null; // prevent UI flash

  return <>{children}</>;
}

