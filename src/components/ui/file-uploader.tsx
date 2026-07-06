"use client";

import * as React from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  bucketName?: string;
  value?: string;
  className?: string;
}

export function FileUploader({
  onUploadComplete,
  bucketName = "avatars",
  value = "",
  className = "",
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File size exceeds 2MB limit.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const supabase = createClient();
      
      // Get current authenticated user id to isolate directories
      const { data: { user } } = await supabase.auth.getUser();
      const folder = user?.id || "anonymous";
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file to Supabase Storage bucket
      const { error: uploadErr } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadErr) {
        // Fallback: convert to base64 Data URL so local testing works without cloud storage configured
        console.warn("Supabase Storage error, falling back to base64 URL:", uploadErr.message);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Url = reader.result as string;
          onUploadComplete(base64Url);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      // Retrieve public URL
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        onUploadComplete(data.publicUrl);
      } else {
        throw new Error("Could not retrieve file public URL.");
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong during file upload.";
      setUploadError(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {value ? (
        /* Image Preview State */
        <div className="relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden border border-border/80 group">
          <img src={value} alt="Upload preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-white/20"
              onClick={onButtonClick}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="h-8 w-8 text-white hover:bg-destructive hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* Dropzone / Upload Action State */
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/10"
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-xs font-semibold mt-2">Uploading image...</p>
            </>
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">Click to upload or drag & drop</p>
                <p className="text-[10px] text-muted-foreground">JPEG, PNG or WEBP (Max 2MB)</p>
              </div>
            </>
          )}

          {uploadError && (
            <p className="text-[10px] text-destructive font-medium mt-1">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
}
