"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { logout } from "@/client/profile";

import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      toast.success("Logged out successfully");

      router.push("/login");
      router.refresh();
    },

    onError: () => {
      toast.error("Failed to logout");
    },
  });

  return (
    <Button
      variant="destructive"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}