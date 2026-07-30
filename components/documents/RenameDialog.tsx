"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { renameDocument } from "@/client/document";

interface Props {
  id: number;
  currentTitle: string;
}

export default function RenameDialog({
  id,
  currentTitle,
}: Props) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);

  const handleRename = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);

      const response = await renameDocument(id, title);

      toast.success(response.message || "Document renamed");

      await queryClient.invalidateQueries({
        queryKey: ["documents"],
      });

      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Rename failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Rename
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Rename Document
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <Button
              className="w-full"
              disabled={loading}
              onClick={handleRename}
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}