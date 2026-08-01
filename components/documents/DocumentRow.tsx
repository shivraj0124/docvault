"use client";

import { FileText, Eye, Download, ImageIcon } from "lucide-react";

import RenameDialog from "./RenameDialog";
import DeleteDialog from "./DeleteDialog";

import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";

interface Document {
  id: number;
  title: string;
  category: string;
  mime_type: string;
  file_size: number;
  file_url: string;
  created_at: string;
  original_name: string;
}

interface Props {
  document: Document;
}
export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
export default function DocumentRow({ document }: Props) {
  // const handleDownload = () => {
  //   saveAs(document.file_url, document?.original_name);
  // };

  const handleDownload = async () => {
    const response = await fetch(`/api/documents/${document.id}`);
    const result = await response.json();

    saveAs(result.data.file_url, document.original_name);
  };
  const handlePreview = async () => {
  const response = await fetch(`/api/documents/${document.id}`);

  const result = await response.json();

  window.open(result.data.file_url, "_blank");
};
  const getFileIcon = (mimeType: string) => {
    if (mimeType === "application/pdf") {
      return <FileText className="h-5 w-5 text-red-500" />;
    }

    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }

    return <FileText className="h-5 w-5 text-gray-500" />;
  };
  return (
    <tr className="border-b">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {/* <FileText size={18} /> */}
          <span>{document.title}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {/* <FileText size={18} /> */}
          <span>{document.category}</span>
        </div>
      </td>

      <td className="px-4 py-3">
        {getFileIcon(document.mime_type)}
        <span>{document.mime_type.split("/")[1].toUpperCase()}</span>
      </td>

      <td className="px-4 py-3">
        {(document.file_size / 1024 / 1024).toFixed(2)} MB
      </td>

      <td className="px-4 py-3">{formatDateTime(document.created_at)}</td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {/* View */}
          <Button
            size="icon"
            variant="outline"
            onClick={handlePreview}
          >
            <Eye size={16} />
          </Button>

          {/* Download */}
          {/* <a href={document.file_url} download> */}
          <Button size="icon" variant="outline" onClick={handleDownload}>
            <Download size={16} />
          </Button>
          {/* </a> */}
          {/* Rename */}
          <RenameDialog id={document.id} currentTitle={document.title} />

          {/* Delete */}
          <DeleteDialog id={document.id} />
        </div>
      </td>
    </tr>
  );
}
