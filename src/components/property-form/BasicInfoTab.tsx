import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoTabProps {
  formData: {
    title: string;
    description: string;
    price: string;
    propertyType: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export function BasicInfoTab({
  formData,
  handleInputChange,
}: BasicInfoTabProps) {
  return (
    <div className="space-y-4 text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-foreground">
            Título da Propriedade <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Ex: Apartamento T3 em Cascais"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-foreground">
            Preço (€) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="Ex: 300000"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="propertyType" className="text-foreground">
            Tipo de Propriedade <span className="text-red-500">*</span>
          </Label>
          <select
            id="propertyType"
            name="propertyType"
            className="flex h-9 w-full rounded-md border border-primary/20 bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            value={formData.propertyType}
            onChange={handleInputChange}
            required
            defaultValue=""
          >
            <option value="" disabled={formData.propertyType !== ""}>
              Selecione
            </option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="villa">Moradia</option>
            <option value="land">Terreno</option>
            <option value="commercial">Comercial</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="area" className="text-foreground">
            Área (m²) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="area"
            name="area"
            type="number"
            placeholder="Ex: 120"
            value={formData.area}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bedrooms" className="text-foreground">
            Quartos
          </Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            placeholder="Ex: 3"
            value={formData.bedrooms}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms" className="text-foreground">
            Casas de Banho
          </Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            placeholder="Ex: 2"
            value={formData.bathrooms}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className="text-foreground">
            Descrição <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Descreva a propriedade em detalhes..."
            value={formData.description}
            onChange={handleInputChange}
            className="min-h-32"
            required
          />
        </div>
      </div>
    </div>
  );
}
