"use client";

import DocumentRow from "./DocumentRow";

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
  documents: Document[];
}

export default function DocumentTable({ documents }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Size</th>
            <th className="px-4 py-3 text-left">Uploaded</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center">
                No documents found.
              </td>
            </tr>
          ) : (
            documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}