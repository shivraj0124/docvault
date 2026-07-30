"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, HardDrive, File, Image } from "lucide-react";

import { getDashboard } from "@/client/dashboard";
import StatCard from "./StarCard";
import RecentUploads from "./RecenUploads";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Something went wrong.</p>;

  const stats = data.data;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Documents"
          value={stats.totalDocuments}
          icon={<FileText size={22} />}
        />

        <StatCard
          title="Storage Used"
          value={`${stats.totalStorageFormatted}`}
          icon={<HardDrive size={22} />}
        />

        <StatCard
          title="PDF Files"
          value={stats.pdfCount}
          icon={<File size={22} />}
        />

        <StatCard
          title="Images"
          value={stats.imageCount}
          icon={<Image size={22} />}
        />
      </div>

      <RecentUploads documents={stats.recentUploads} />
    </div>
  );
}