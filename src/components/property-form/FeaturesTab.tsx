import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Feature {
  id: string;
  name: string;
  checked: boolean;
  isCustom?: boolean;
}

interface FeaturesTabProps {
  features: string[];
  onFeaturesChange: (features: string[]) => void;
}

export function FeaturesTab({ features, onFeaturesChange }: FeaturesTabProps) {
  const defaultFeatures = [
    { id: "garage", name: "Garagem", checked: features.includes("garage") },
    { id: "pool", name: "Piscina", checked: features.includes("pool") },
    { id: "garden", name: "Jardim", checked: features.includes("garden") },
    { id: "balcony", name: "Varanda", checked: features.includes("balcony") },
    {
      id: "elevator",
      name: "Elevador",
      checked: features.includes("elevator"),
    },
    {
      id: "security",
      name: "Segurança 24h",
      checked: features.includes("security"),
    },
    {
      id: "furnished",
      name: "Mobilado",
      checked: features.includes("furnished"),
    },
    {
      id: "airConditioning",
      name: "Ar Condicionado",
      checked: features.includes("airConditioning"),
    },
    {
      id: "heating",
      name: "Aquecimento",
      checked: features.includes("heating"),
    },
    {
      id: "storage",
      name: "Arrecadação",
      checked: features.includes("storage"),
    },
  ];

  // Find custom features (those in features array but not in defaultFeatures)
  const customFeatureIds = features.filter(
    (id) => !defaultFeatures.some((df) => df.id === id),
  );

  // Create initial features list with custom features marked
  const initialFeaturesList = [
    ...defaultFeatures,
    ...customFeatureIds.map((id) => ({
      id,
      name: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      checked: true,
      isCustom: true,
    })),
  ];

  const [featuresList, setFeaturesList] =
    useState<Feature[]>(initialFeaturesList);
  const [customFeature, setCustomFeature] = useState("");
  const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleFeatureChange = (id: string, checked: boolean) => {
    const updatedFeatures = featuresList.map((feature) =>
      feature.id === id ? { ...feature, checked } : feature,
    );

    setFeaturesList(updatedFeatures);

    // Update parent component with selected features
    const selectedFeatures = updatedFeatures
      .filter((feature) => feature.checked)
      .map((feature) => feature.id);

    onFeaturesChange(selectedFeatures);
  };

  const addCustomFeature = () => {
    if (customFeature.trim() === "") return;

    const newFeatureId = customFeature.toLowerCase().replace(/\s+/g, "-");

    if (featuresList.some((feature) => feature.id === newFeatureId)) {
      return; // Feature already exists
    }

    const updatedFeatures = [
      ...featuresList,
      { id: newFeatureId, name: customFeature, checked: true, isCustom: true },
    ];

    setFeaturesList(updatedFeatures);
    setCustomFeature("");

    // Update parent component with selected features
    const selectedFeatures = updatedFeatures
      .filter((feature) => feature.checked)
      .map((feature) => feature.id);

    onFeaturesChange(selectedFeatures);
  };

  const handleDeleteClick = (feature: Feature) => {
    setFeatureToDelete(feature);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!featureToDelete) return;

    const updatedFeatures = featuresList.filter(
      (feature) => feature.id !== featureToDelete.id,
    );

    setFeaturesList(updatedFeatures);
    setShowDeleteDialog(false);
    setFeatureToDelete(null);

    // Update parent component with selected features
    const selectedFeatures = updatedFeatures
      .filter((feature) => feature.checked)
      .map((feature) => feature.id);

    onFeaturesChange(selectedFeatures);
  };

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h3 className="text-lg font-medium mb-4 text-primary/100">
          Características da Propriedade
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuresList.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2 group">
              <Checkbox
                id={feature.id}
                checked={feature.checked}
                onCheckedChange={(checked) =>
                  handleFeatureChange(feature.id, checked === true)
                }
              />
              <Label htmlFor={feature.id} className="cursor-pointer flex-grow">
                {feature.name}
              </Label>
              {feature.isCustom && (
                <button
                  type="button"
                  onClick={() => handleDeleteClick(feature)}
                  className="text-red-500"
                  aria-label={`Remover ${feature.name}`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4 text-primary/100">
          Adicionar Característica Personalizada
        </h3>
        <div className="flex space-x-2 items-center justify-start">
          <Input
            placeholder="Ex: Churrasqueira"
            value={customFeature}
            onChange={(e) => setCustomFeature(e.target.value)}
            className="max-w-sm"
          />
          <button
            type="button"
            onClick={addCustomFeature}
            className="px-4 text-primary-foreground transition-colors hover:bg-black-100/90 border-solid rounded border-accent border-accent-foreground/5 border-amber-100/60 border-accent-foreground/25 text-amber-300/0 text-amber-900/20 text-blue-950/95 text-[#172554f2] border-[#172554f2] border py-1.5"
          >
            Adicionar
          </button>
        </div>
      </div>
      {/* Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Remoção</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Tem certeza que deseja remover a característica "
            {featureToDelete?.name}"?
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
