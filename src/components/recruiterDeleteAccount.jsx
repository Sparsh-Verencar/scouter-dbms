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

export default function RecruiterDeleteAccount() {
  const router = useRouter()

  const [open, setOpen] = useState(false);
async function deleteAccount() {
    const res = await fetch("http://localhost:3001/api/auth/recruiter-delete", {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);
    setOpen(true)
    if (res.ok) {
      alert("Account deleted");
      router.push("/"); // redirect
    } else {
      alert(data.error || "Error deleting account");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex">
          <DoorClosedIcon />
          Delete Account
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <div className="flex items-start space-x-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <DialogHeader>
            <DialogTitle>Deactivate account</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate your account? All of your data
              will be permanently removed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={deleteAccount}>
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
