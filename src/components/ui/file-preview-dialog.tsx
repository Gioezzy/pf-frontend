"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { buttonVariants } from "@/src/components/ui/button";
import { DownloadIcon, FileIcon } from "lucide-react";

interface FilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
  fileName?: string;
  fileType?: "image" | "pdf" | "unknown";
}

export function FilePreviewDialog({ isOpen, onClose, fileUrl, fileName = "File", fileType = "unknown" }: FilePreviewDialogProps) {
  if (!fileUrl) return null;

  const isPdf = fileUrl.toLowerCase().endsWith(".pdf") || fileType === "pdf";
  const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null || fileType === "image";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center w-full">
            <DialogTitle className="text-lg font-bold">{fileName}</DialogTitle>
            <a 
              href={fileUrl} 
              download 
              target="_blank" 
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download
            </a>
          </div>
          <DialogDescription className="sr-only">Preview of {fileName}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 bg-muted/20 relative overflow-hidden flex items-center justify-center p-4">
          {isImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={fileUrl} alt={fileName} className="max-w-full max-h-full object-contain" />
            </div>
          ) : isPdf ? (
            <iframe src={`${fileUrl}#toolbar=0`} className="w-full h-full border-0" title={fileName} />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
              <FileIcon className="h-16 w-16" />
              <p>Preview format tidak didukung.</p>
              <a 
                href={fileUrl} 
                download 
                target="_blank" 
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "default" })}
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
