import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationTabProps {
  formData: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export function LocationTab({ formData, handleInputChange }: LocationTabProps) {
  return (
    <div className="space-y-4 text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address" className="text-foreground">
            Endereço <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            name="address"
            placeholder="Ex: Rua das Palmeiras, 123"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-foreground">
            Cidade <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            name="city"
            placeholder="Ex: Cascais"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state" className="text-foreground">
            Distrito <span className="text-red-500">*</span>
          </Label>
          <Input
            id="state"
            name="state"
            placeholder="Ex: Lisboa"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-foreground">
            Código Postal <span className="text-red-500">*</span>
          </Label>
          <Input
            id="zipCode"
            name="zipCode"
            placeholder="Ex: 2750-004"
            value={formData.zipCode}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
}
