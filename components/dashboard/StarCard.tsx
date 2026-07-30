import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">{title}</h3>
        {icon}
      </div>

      <p className="mt-4 text-3xl font-bold">{value}</p>
    </div>
  );
}