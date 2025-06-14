import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { updateUserAction } from "@/app/actions/user";

export type User = {
  id: string;
  full_name?: string;
  name?: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  subscription?: string;
};

interface UserEditFormProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

export default function UserEditForm({
  user,
  onSave,
  onCancel,
}: UserEditFormProps) {
  const [formData, setFormData] = useState<User>({
    ...user,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateField = (field: keyof User, value: string): string | null => {
    switch (field) {
      case "email":
        if (!value) return "O e-mail é obrigatório";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Por favor, insira um e-mail válido";
        }
        return null;
      case "full_name":
        if (!value) return "O nome é obrigatório";
        if (value.length < 2) return "O nome deve ter pelo menos 2 caracteres";
        return null;
      case "role":
        if (!value) return "A função é obrigatória";
        return null;
      case "status":
        if (!value) return "O status é obrigatório";
        return null;
      case "subscription":
        return null; // Subscription is optional
      default:
        return null;
    }
  };

  const handleChange = (field: keyof User, value: string) => {
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;

    const nameError = validateField(
      "full_name",
      formData.full_name || formData.name || "",
    );
    if (nameError) newErrors.full_name = nameError;

    const roleError = validateField("role", formData.role);
    if (roleError) newErrors.role = roleError;

    const statusError = validateField("status", formData.status);
    if (statusError) newErrors.status = statusError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for update
      const updateData = {
        id: formData.id,
        full_name: formData.full_name || formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        subscription: formData.subscription,
      };

      const result = await updateUserAction(updateData);

      if (result.success) {
        // Call the onSave callback with the updated user data
        onSave(formData);
      } else {
        setSubmitError(result.error || "Erro ao atualizar utilizador");
      }
    } catch (error: any) {
      setSubmitError(
        error.message || "Ocorreu um erro ao salvar as alterações",
      );
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 mb-4">
          {submitError}
        </div>
      )}

      <div className="space-y-2">
        <Label
          htmlFor="full_name"
          className={errors.full_name ? "text-red-500" : ""}
        >
          Nome Completo
        </Label>
        <Input
          id="full_name"
          value={formData.full_name || formData.name || ""}
          onChange={(e) => handleChange("full_name", e.target.value)}
          className={errors.full_name ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.full_name && (
          <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={errors.email ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className={errors.role ? "text-red-500" : ""}>
          Função
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleChange("role", value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className={errors.role ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecione uma função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="administrador">Administrador</SelectItem>
            <SelectItem value="comprador(a)">Utilizador</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className={errors.status ? "text-red-500" : ""}>
          Status
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange("status", value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className={errors.status ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecione um status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="suspended">Suspenso</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-red-500 text-sm mt-1">{errors.status}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="subscription"
          className={errors.subscription ? "text-red-500" : ""}
        >
          Plano de Assinatura
        </Label>
        <Select
          value={formData.subscription || "free"}
          onValueChange={(value) => handleChange("subscription", value)}
          disabled={isSubmitting}
        >
          <SelectTrigger
            className={errors.subscription ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Selecione um plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Gratuito</SelectItem>
            <SelectItem value="basic">Básico</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="professional">Profissional</SelectItem>
          </SelectContent>
        </Select>
        {errors.subscription && (
          <p className="text-red-500 text-sm mt-1">{errors.subscription}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "A guardar..." : "Guardar Alterações"}
        </Button>
      </div>
    </form>
  );
}
