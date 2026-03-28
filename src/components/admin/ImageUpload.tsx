import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  previewClassName?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Ảnh",
  accept = "image/*",
  previewClassName = "h-32 w-full object-cover",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File quá lớn", description: "Vui lòng chọn file nhỏ hơn 5MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("site-media")
        .getPublicUrl(filePath);

      onChange(urlData.publicUrl);
      toast({ title: "Tải lên thành công!" });
    } catch (err: any) {
      toast({ title: "Lỗi tải lên", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="https://... hoặc upload bên dưới"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="whitespace-nowrap"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-1" />
            )}
            {uploading ? "Đang tải..." : "Upload"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />
      {value ? (
        <img
          src={value}
          alt={label}
          className={`rounded border border-border ${previewClassName}`}
        />
      ) : (
        <div className="flex items-center justify-center h-24 rounded border-2 border-dashed border-border text-muted-foreground">
          <ImageIcon className="w-6 h-6 mr-2" />
          <span className="text-sm">Chưa có ảnh</span>
        </div>
      )}
    </div>
  );
}
