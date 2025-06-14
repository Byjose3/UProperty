"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Building,
  MapPin,
  Home,
  Image,
  Check,
  Loader2,
} from "lucide-react";
import { BasicInfoTab } from "./property-form/BasicInfoTab";
import { LocationTab } from "./property-form/LocationTab";
import { FeaturesTab } from "./property-form/FeaturesTab";
import { MediaTab } from "./property-form/MediaTab";
import { createProperty, type PropertyData } from "@/services/propertyService";
import { useToast } from "@/hooks/use-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface PropertyFormProps {
  onSubmit?: (data: any) => void;
  initialData?: any;
}

export default function PropertyForm({
  onSubmit,
  initialData = {},
}: PropertyFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = ["basic-info", "location", "features", "media"];
  const currentTabIndex = tabs.indexOf(activeTab);
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    price: initialData.price || "",
    propertyType: initialData.propertyType || "",
    bedrooms: initialData.bedrooms || "",
    bathrooms: initialData.bathrooms || "",
    area: initialData.area || "",
    address: initialData.address || "",
    city: initialData.city || "",
    state: initialData.state || "",
    zipCode: initialData.zipCode || "",
    features: initialData.features || [],
    images: initialData.images || [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateCurrentTab = () => {
    switch (activeTab) {
      case "basic-info":
        return (
          formData.title.trim() !== "" &&
          formData.description.trim() !== "" &&
          formData.price.trim() !== "" &&
          formData.propertyType.trim() !== "" &&
          formData.area.trim() !== ""
        );
      case "location":
        return (
          formData.address.trim() !== "" &&
          formData.city.trim() !== "" &&
          formData.state.trim() !== "" &&
          formData.zipCode.trim() !== ""
        );
      case "features":
        return true; // Features tab has no required fields
      case "media":
        return true; // Media tab has no required fields
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1 && validateCurrentTab()) {
      setActiveTab(tabs[currentTabIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1]);
    }
  };

  const isNextEnabled = validateCurrentTab();
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isFirstTab = currentTabIndex === 0;

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: "Erro de Autenticação",
          description: "Você precisa estar logado para criar uma propriedade.",
          variant: "destructive",
        });
        return;
      }

      // Validate required fields
      if (
        !formData.title ||
        !formData.description ||
        !formData.price ||
        !formData.propertyType ||
        !formData.area ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.zipCode
      ) {
        toast({
          title: "Campos Obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      // Prepare property data
      const propertyData: PropertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        property_type: formData.propertyType,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms
          ? parseInt(formData.bathrooms)
          : undefined,
        area: parseFloat(formData.area),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        features: formData.features,
        images: formData.images,
        status: isDraft ? "draft" : "active",
      };

      if (onSubmit) {
        onSubmit(propertyData);
        return;
      }

      // Create property in database
      const result = await createProperty(supabase, propertyData, user.id);

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: isDraft
            ? "Propriedade salva como rascunho com sucesso."
            : "Propriedade publicada com sucesso.",
        });

        // Navigate back to properties list
        router.push("/dashboard/owner/properties");
      } else {
        toast({
          title: "Erro ao Salvar",
          description:
            result.error || "Ocorreu um erro ao salvar a propriedade.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Check if there's a custom back handler provided (useful for storyboards/testing)
    if (
      initialData.handleBackOverride &&
      typeof initialData.handleBackOverride === "function"
    ) {
      initialData.handleBackOverride();
      return;
    }

    try {
      // First try to use router.back() which navigates to the previous page in the history stack
      router.back();

      // As a fallback, we'll set a timeout to check if navigation happened
      // If not, we'll redirect to the owner properties page
      const fallbackTimeout = setTimeout(() => {
        router.push("/dashboard/owner/properties");
      }, 100);

      // Clear the timeout if component unmounts
      return () => clearTimeout(fallbackTimeout);
    } catch (error) {
      console.error("Navigation error:", error);
      // If router.back() fails, navigate to the owner properties page
      router.push("/dashboard/owner/properties");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-background">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Adicionar Nova Propriedade
        </h1>
      </div>
      <Card className="shadow-sm border-primary/10">
        <CardHeader className="border-b border-primary/5">
          <CardTitle className="text-xl text-primary/100">
            Detalhes da Propriedade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs
              defaultValue="basic-info"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-8 bg-primary/3">
                <TabsTrigger value="basic-info" className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Informações Básicas
                </TabsTrigger>
                <TabsTrigger value="location" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Localização
                </TabsTrigger>
                <TabsTrigger value="features" className="flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Características
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center">
                  <Image className="h-4 w-4 mr-2" />
                  Mídia
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info" className="space-y-4">
                <BasicInfoTab
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <LocationTab
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <FeaturesTab
                  features={formData.features}
                  onFeaturesChange={(features) => {
                    setFormData((prev) => ({
                      ...prev,
                      features,
                    }));
                  }}
                />
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <MediaTab
                  images={formData.images}
                  onImagesChange={(images) => {
                    setFormData((prev) => ({
                      ...prev,
                      images,
                    }));
                  }}
                />
              </TabsContent>
            </Tabs>

            <CardFooter className="flex justify-between pt-6 px-0">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-primary/30 hover:bg-primary/5"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                {!isFirstTab && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="border-primary/30 hover:bg-primary/5"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/5"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Guardar Rascunho
                </Button>

                {!isLastTab ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isNextEnabled || isSubmitting}
                    className="bg-orange-500 hover:bg-primary"
                  >
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex items-center bg-orange-500 hover:bg-primary"
                    disabled={isSubmitting}
                    onClick={(e) => handleSubmit(e, false)}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Publicar Propriedade
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
