"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/client/profile";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";

import { Mail, Calendar } from "lucide-react";

import UpdateProfileDialog from "./UpdateProfileDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import LogoutButton from "./LogoutButton";


const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ProfilePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError || !data?.user) {
    return (
      <div className="flex justify-center mt-10">
        <p>Unable to load profile.</p>
      </div>
    );
  }

  const user = data.user;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            My Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {console.log(user)}
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h2 className="text-xl font-bold">
                {user.name}
              </h2>

              <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2">
                <Mail size={16} />
                {user.email}
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2">
                <Calendar size={16} />
                Joined {formatDate(user.created_at)}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <UpdateProfileDialog user={user} />

            <ChangePasswordDialog />

            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}