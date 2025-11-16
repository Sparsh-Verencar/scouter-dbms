"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangleIcon, DoorClosedIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation"

export default function Logout() {
  const router = useRouter()

  const [open, setOpen] = useState(false);
const handleFreelancerLogout = async () => {
    try {
      console.log("logout clicked")
      await fetch("http://localhost:3001/api/auth/freelancer-logout", {
        method: "POST",
        credentials: "include", // VERY IMPORTANT — includes your auth cookie
      });
      // redirect to login page
      setOpen(true)
      router.push("/freelancer-login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex">
          <DoorClosedIcon />
          Logout
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <div className="flex items-start space-x-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <DialogHeader>
            <DialogTitle>Logout account</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout from your account? 
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleFreelancerLogout}>
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
