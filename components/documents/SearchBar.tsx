"use client";

import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <Input
      placeholder="Search documents..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}