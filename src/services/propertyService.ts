import type { SupabaseClient } from "@supabase/supabase-js";

export interface PropertyData {
  title: string;
  description: string;
  price: number;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  features: string[];
  images: string[];
  status?: string;
}

/**
 * Creates a new property in the database
 * @param supabase - The Supabase client instance
 * @param propertyData - The property data to insert
 * @param userId - The ID of the user creating the property
 * @returns The created property data or null if an error occurred
 */
export const createProperty = async (
  supabase: SupabaseClient,
  propertyData: PropertyData,
  userId: string,
) => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .insert({
        user_id: userId,
        title: propertyData.title,
        description: propertyData.description,
        price: propertyData.price,
        property_type: propertyData.property_type,
        bedrooms: propertyData.bedrooms || null,
        bathrooms: propertyData.bathrooms || null,
        area: propertyData.area,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        zip_code: propertyData.zip_code,
        features: propertyData.features,
        images: propertyData.images,
        status: propertyData.status || "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating property:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error creating property:", err);
    return { success: false, error: "Unexpected error occurred" };
  }
};

/**
 * Fetches properties for a specific user
 * @param supabase - The Supabase client instance
 * @param userId - The ID of the user whose properties to fetch
 * @returns The user's properties or null if an error occurred
 */
export const getUserProperties = async (
  supabase: SupabaseClient,
  userId: string,
) => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user properties:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error fetching user properties:", err);
    return null;
  }
};

/**
 * Updates the status of a property
 * @param supabase - The Supabase client instance
 * @param propertyId - The ID of the property to update
 * @param status - The new status (e.g., "draft", "active", "inactive")
 * @returns The updated property data or null if an error occurred
 */
export const updatePropertyStatus = async (
  supabase: SupabaseClient,
  propertyId: string,
  status: string,
) => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .update({
        status: status,
      })
      .eq("id", propertyId)
      .select()
      .single();

    if (error) {
      console.error("Error updating property status:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating property status:", err);
    return null;
  }
};

/**
 * Toggles a property between active and draft status
 * @param supabase - The Supabase client instance
 * @param propertyId - The ID of the property to toggle
 * @param currentStatus - The current status of the property
 * @returns The updated property data or null if an error occurred
 */
export const togglePropertyStatus = async (
  supabase: SupabaseClient,
  propertyId: string,
  currentStatus: string,
) => {
  // Determine the new status based on the current status
  const newStatus =
    currentStatus.toLowerCase() === "active" ? "draft" : "active";

  return updatePropertyStatus(supabase, propertyId, newStatus);
};
