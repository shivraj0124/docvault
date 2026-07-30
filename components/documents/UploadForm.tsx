"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { uploadDocument } from "@/client/document";
import { CATEGORIES } from "@/constants/categories";

interface Props {
  onSuccess: () => void;
}

export default function UploadForm({ onSuccess }: Props) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Others");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("file", file);

      const response = await uploadDocument(formData);

      toast.success(response.message || "Document uploaded successfully");

      await queryClient.invalidateQueries({
        queryKey: ["documents"],
      });

      // Reset form
      setTitle("");
      setCategory("Others");
      setFile(null);

      onSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Title
        </label>

        <Input
          placeholder="Enter document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* File */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Select File
        </label>

        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <Button
        className="w-full"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}