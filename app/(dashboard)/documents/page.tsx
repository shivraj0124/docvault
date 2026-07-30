"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getDocuments } from "@/client/document";

import SearchBar from "@/components/documents/SearchBar";
import DocumentTable from "@/components/documents/DocumentTable";
import UploadDialog from "@/components/documents/UploadDialog";
import Pagination from "@/components/documents/Pagination";

import useDebounce from "@/hooks/useDebounce";
import { CATEGORIES } from "@/constants/categories";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["documents", page, debouncedSearch, category],
    queryFn: () =>
      getDocuments(
        page,
        10,
        debouncedSearch,
        category === "All" ? "" : category
      ),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <p>Loading documents...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-10">
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Documents</h1>

        <UploadDialog />
      </div>

      {/* Search + Category Filter */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
        </div>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-60"
        >
          <option value="All">All Categories</option>

          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Documents Table */}
      <DocumentTable documents={data?.data ?? []} />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={data?.pagination?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}