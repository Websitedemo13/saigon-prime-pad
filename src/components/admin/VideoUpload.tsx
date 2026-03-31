import { useState, useRef } from "react";
import { Upload, X, Loader2, Video, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function VideoUpload({ value, onChange, label = "Video" }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File quá lớn", description: "Vui lòng chọn file nhỏ hơn 50MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("site-media")
        .getPublicUrl(filePath);

      onChange(urlData.publicUrl);
      toast({ title: "Tải video lên thành công!" });
    } catch (err: any) {
      toast({ title: "Lỗi tải lên", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const isYouTube = value?.includes("youtube") || value?.includes("youtu.be");

  return (
    <div className="space-y-3">
      <Tabs defaultValue={isYouTube || !value ? "url" : "upload"}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="url" className="text-xs">
            <LinkIcon className="w-3.5 h-3.5 mr-1" /> URL / YouTube
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-xs">
            <Upload className="w-3.5 h-3.5 mr-1" /> Upload MP4
          </TabsTrigger>
        </TabsList>
        <TabsContent value="url" className="mt-2">
          <Input
            placeholder="https://youtube.com/watch?v=... hoặc URL video"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </TabsContent>
        <TabsContent value="upload" className="mt-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="whitespace-nowrap"
            >
              {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
              {uploading ? "Đang tải..." : "Chọn video"}
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="video/*" onChange={handleUpload} className="hidden" />
        </TabsContent>
      </Tabs>

      {value && (
        <div className="rounded-lg overflow-hidden border border-border bg-muted/30">
          {isYouTube ? (
            <iframe
              src={value.replace("watch?v=", "embed/")}
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video controls className="w-full aspect-video">
              <source src={value} type="video/mp4" />
            </video>
          )}
        </div>
      )}

      {!value && (
        <div className="flex items-center justify-center h-24 rounded border-2 border-dashed border-border text-muted-foreground">
          <Video className="w-6 h-6 mr-2" />
          <span className="text-sm">Chưa có video</span>
        </div>
      )}
    </div>
  );
}
