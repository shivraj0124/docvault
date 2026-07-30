interface RecentUploadsProps {
  documents: {
    id: number;
    title: string;
    created_at: string;
  }[];
}

export default function RecentUploads({
  documents,
}: RecentUploadsProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">
        Recent Uploads
      </h2>

      <div className="space-y-4">
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <span>{doc.title}</span>

              <span className="text-sm text-gray-500">
                {new Date(doc.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}