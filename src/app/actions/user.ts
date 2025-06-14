"use server";

import { createClient } from "../../../supabase/server";

export type UserUpdateData = {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  status?: string;
  subscription?: string;
};

/**
 * Updates a user's information in the database
 * @param userData - User data to update
 * @returns The updated user data or null if an error occurred
 */
export async function updateUserAction(userData: UserUpdateData) {
  const supabase = await createClient();

  try {
    // Validate required fields
    if (!userData.id) {
      throw new Error("User ID is required");
    }

    // Prepare update data (only include fields that are provided)
    const updateData: Record<string, any> = {};
    if (userData.full_name !== undefined)
      updateData.full_name = userData.full_name;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.role !== undefined) updateData.role = userData.role;
    if (userData.status !== undefined) updateData.status = userData.status;
    if (userData.subscription !== undefined)
      updateData.subscription = userData.subscription;

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    // Update the user in the database
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userData.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      throw error;
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error in updateUserAction:", error.message);
    return {
      success: false,
      error: error.message || "An error occurred while updating the user",
    };
  }
}
