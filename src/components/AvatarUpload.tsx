import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  avatarUrl: string | null;
  name: string;
  onUploaded: (url: string) => void;
}

export default function AvatarUpload({ avatarUrl, name, onUploaded }: AvatarUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Formato inválido", description: "Envie uma imagem (JPG, PNG, etc).", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "Máximo de 5 MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      toast({ title: "Erro no upload", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${publicData.publicUrl}?t=${Date.now()}`;

    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);

    onUploaded(publicUrl);
    toast({ title: "Foto atualizada! 📸" });
    setUploading(false);

    // Reset input
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="relative group cursor-pointer" onClick={() => !uploading && inputRef.current?.click()}>
      <Avatar className="w-16 h-16 rounded-2xl">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
        ) : null}
        <AvatarFallback className="rounded-2xl gradient-primary text-primary-foreground text-lg font-medium">
          {initials || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {uploading ? (
          <Loader2 size={20} className="text-white animate-spin" />
        ) : (
          <Camera size={20} className="text-white" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
