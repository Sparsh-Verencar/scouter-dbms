"use client"
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button onClick={()=>router.push("/freelancer-dashboard")}>
        sparsh vaibhav balaji
      </Button>
      <Button onClick={()=>router.push("/login")}>
        temp
      </Button>
      <ModeToggle/>
    </div>
  );
}
