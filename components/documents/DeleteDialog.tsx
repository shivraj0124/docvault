"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { deleteDocument } from "@/client/document";

interface Props {
  id: number;
}

export default function DeleteDialog({ id }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await deleteDocument(id);

      toast.success(response.message || "Document deleted");

      await queryClient.invalidateQueries({
        queryKey: ["documents"],
      });

      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Delete failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this document?
            This action cannot be undone.
          </p>

          <DialogFooter showCloseButton>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}