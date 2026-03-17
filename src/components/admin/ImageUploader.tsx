import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  /** Folder inside the content-images bucket */
  folder: "exercises" | "recipes";
  /** Current image URLs */
  images: string[];
  /** Callback when images change */
  onChange: (urls: string[]) => void;
  /** Allow multiple images (default true) */
  multiple?: boolean;
  label?: string;
}

const BUCKET = "content-images";

const ImageUploader = ({
  folder,
  images,
  onChange,
  multiple = true,
  label = "Imagens",
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (error) {
          toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
          continue;
        }

        newUrls.push(getPublicUrl(fileName));
      }

      if (multiple) {
        onChange([...images, ...newUrls]);
      } else {
        onChange(newUrls.length > 0 ? [newUrls[0]] : images);
      }

      if (newUrls.length > 0) {
        toast({ title: `${newUrls.length} imagem(ns) enviada(s) ✅` });
      }
    } catch (err) {
      toast({ title: "Erro no upload", variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <Label className="text-foreground">{label}</Label>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt={`Imagem ${i + 1}`}
                className="w-20 h-20 rounded-lg object-cover border border-white/10"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="border-white/10 text-foreground gap-2"
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Enviando...
            </>
          ) : (
            <>
              <Upload size={14} /> {multiple ? "Adicionar imagens" : "Enviar imagem"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;
