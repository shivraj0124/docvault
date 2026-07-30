"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SearchBar from "./SearchBar";
import DocumentTable from "./DocumentTable";
import UploadDialog from "./UploadDialog";

import { getDocuments } from "@/client/document";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["documents", page, search],
    queryFn: () => getDocuments(page, 10, search),
  });

  if (isLoading) {
    return <p>Loading documents...</p>;
  }

  if (isError) {
    return (
      <p>
        {(error as Error)?.message || "Something went wrong."}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Documents</h1>

        <UploadDialog />
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <DocumentTable
        documents={data?.documents ?? []}
      />

      
    </div>
  );
}