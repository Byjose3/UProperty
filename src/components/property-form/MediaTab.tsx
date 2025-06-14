import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, X } from "lucide-react";

interface MediaTabProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function MediaTab({ images, onImagesChange }: MediaTabProps) {
  const [previewImages, setPreviewImages] = useState<string[]>(images);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);

    const newFiles = Array.from(e.target.files);
    const newPreviewImages: string[] = [];

    newFiles.forEach((file) => {
      // In a real implementation, you would upload to a server/storage
      // For now, we'll just create local object URLs for preview
      const objectUrl = URL.createObjectURL(file);
      newPreviewImages.push(objectUrl);
    });

    const updatedImages = [...previewImages, ...newPreviewImages];
    setPreviewImages(updatedImages);
    onImagesChange(updatedImages);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const updatedImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h3 className="text-lg font-medium mb-4 text-primary/70">
          Imagens da Propriedade
        </h3>
        <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center bg-primary/5">
          <div className="space-y-2">
            <div className="flex justify-center">
              <Upload className="h-10 w-10 text-primary/40" />
            </div>
            <p className="text-sm text-gray-500">
              Arraste e solte imagens aqui ou clique para selecionar
            </p>
            <p className="text-xs text-gray-400">
              Formatos suportados: JPG, PNG, WEBP. Máximo 10MB por imagem.
            </p>
            <div>
              <Label htmlFor="image-upload" className="sr-only">
                Selecionar imagens
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={uploading}
              >
                {uploading ? "Carregando..." : "Selecionar Imagens"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {previewImages.length > 0 && (
        <div className="pt-4">
          <h3 className="text-lg font-medium mb-4 text-primary/70">
            Imagens Carregadas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={image}
                    alt={`Imagem da propriedade ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                setPreviewImages([]);
                onImagesChange([]);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remover Todas as Imagens
            </Button>
          </div>
        </div>
      )}

      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium mb-4 text-primary/70">
          Vídeo da Propriedade
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-url" className="text-muted-foreground">
              URL do Vídeo (YouTube, Vimeo)
            </Label>
            <Input
              id="video-url"
              placeholder="Ex: https://www.youtube.com/watch?v=..."
            />
          </div>
          <p className="text-sm text-gray-500">
            Adicione um link para um vídeo do YouTube ou Vimeo que mostre a
            propriedade.
          </p>
        </div>
      </div>
    </div>
  );
}
