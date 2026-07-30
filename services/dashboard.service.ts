import { getDashboardStats } from "@/repositories/dashboard.repository";

export async function dashboardService(userId: number) {
  const result = await getDashboardStats(userId);
  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  return {
    totalDocuments: Number(result.stats.totalDocuments),
    totalStorageUsed: Number(result.stats.totalStorageUsed),
    totalStorageFormatted: formatBytes(Number(result.stats.totalStorageUsed)),
    pdfCount: Number(result.stats.pdfCount),
    imageCount: Number(result.stats.imageCount),
    otherCount: Number(result.stats.otherCount),
    recentUploads: result.recentUploads,
  };
}
