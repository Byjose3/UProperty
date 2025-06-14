import { createClient } from "../../supabase/server";

/**
 * Ensures a user exists in the public.users table
 * This is useful when a user exists in auth.users but not in public.users
 */
/**
 * Ensures a user exists in the public.users table with the correct role
 * @param userId - The user's ID from auth.users
 * @param email - The user's email address
 * @param role - The user's role (defaults to "buyer")
 * @param additionalData - Optional additional user data like nif and contact
 * @returns Object with success status and details about the operation
 */
import { supabase as clientSupabase } from "../../supabase/supabase";

/**
 * Ensures a user exists in the public.users table
 * This is useful when a user exists in auth.users but not in public.users
 */
/**
 * Ensures a user exists in the public.users table with the correct role
 * @param userId - The user's ID from auth.users
 * @param email - The user's email address
 * @param role - The user's role (defaults to "buyer")
 * @param additionalData - Optional additional user data like nif and contact
 * @param checkSubscription - Whether to check and create subscription for owners (defaults to false)
 * @returns Object with success status and details about the operation
 */
export const ensureUserInPublicTable = async (
  userId: string,
  email: string,
  role: string = "comprador(a)",
  additionalData?: { nif?: string; contact?: string },
  checkSubscription: boolean = false,
) => {
  const supabase = await createClient();

  try {
    console.log(
      `Ensuring user exists in public.users table: ${userId}, ${email}, role: ${role}`,
    );

    // Check if user exists in public.users
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (checkError) {
      if (checkError.code === "PGRST116") {
        // PGRST116 is "not found" - this is expected if the user doesn't exist yet
        console.log(
          `User ${userId} not found in public.users table, will create`,
        );
      } else {
        console.error(
          "Error checking user existence:",
          checkError.message,
          checkError.code,
        );
        return {
          success: false,
          error: checkError,
          message: "Error checking if user exists",
        };
      }
    } else {
      console.log(
        `User ${userId} found in public.users table:`,
        JSON.stringify(existingUser),
      );
      // If user exists but has no role, update it
      if (!existingUser.role) {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            role: role.toLowerCase(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (updateError) {
          console.error(
            "Error updating user role:",
            updateError.message,
            updateError.code,
          );
          return {
            success: false,
            error: updateError,
            message: "Error updating user role",
          };
        }

        console.log(`Updated role for user ${userId} to ${role.toLowerCase()}`);
        return { success: true, created: false, updated: true };
      }

      return { success: true, created: false, updated: false };
    }

    // If user doesn't exist, create them
    if (!existingUser) {
      const userData = {
        id: userId,
        user_id: userId,
        email: email,
        name: email.split("@")[0], // Default name from email
        token_identifier: userId,
        created_at: new Date().toISOString(),
        role: role.toLowerCase(),
        status: "active",
        nif: additionalData?.nif || null,
        contact: additionalData?.contact || null,
      };

      console.log(
        `Inserting new user into public.users:`,
        JSON.stringify(userData),
      );

      // First check if the user already exists with a different ID
      const { data: existingEmailUser, error: emailCheckError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (emailCheckError) {
        console.error(
          "Error checking for existing email:",
          emailCheckError.message,
        );
      } else if (existingEmailUser) {
        console.log(
          `User with email ${email} already exists with ID ${existingEmailUser.id}, updating record`,
        );

        // Update the existing record instead of creating a new one
        const { error: updateError } = await supabase
          .from("users")
          .update({
            id: userId,
            user_id: userId,
            token_identifier: userId,
            updated_at: new Date().toISOString(),
            role: role.toLowerCase(),
            status: "active",
            nif: additionalData?.nif || null,
            contact: additionalData?.contact || null,
          })
          .eq("email", email);

        if (updateError) {
          console.error("Error updating existing user:", updateError.message);
          return {
            success: false,
            error: updateError,
            message: "Error updating existing user",
          };
        }

        return { success: true, created: false, updated: true };
      }

      // If no existing user with this email, insert a new record
      const { data: insertedUser, error: insertError } = await supabase
        .from("users")
        .insert(userData)
        .select()
        .single();

      if (insertError) {
        console.error(
          "Error creating user in public table:",
          insertError.message,
          insertError.code,
        );

        // If the error is a duplicate key violation, try to update instead
        if (insertError.code === "23505") {
          // PostgreSQL unique violation code
          console.log(
            "Duplicate key violation, attempting to update existing record",
          );

          const { error: updateError } = await supabase
            .from("users")
            .update({
              email: email,
              name: email.split("@")[0],
              role: role.toLowerCase(),
              status: "active",
              updated_at: new Date().toISOString(),
              nif: additionalData?.nif || null,
              contact: additionalData?.contact || null,
            })
            .eq("id", userId);

          if (updateError) {
            console.error(
              "Error updating user after insert failure:",
              updateError.message,
            );
            return {
              success: false,
              error: updateError,
              message: "Error updating user after insert failure",
            };
          }

          return { success: true, created: false, updated: true };
        }

        return {
          success: false,
          error: insertError,
          message: "Error creating user",
        };
      }

      console.log(
        "Created user in public.users table:",
        userId,
        insertedUser ? JSON.stringify(insertedUser) : "",
      );
      // If checkSubscription is true, ensure they have a freemium subscription
      if (checkSubscription) {
        try {
          const { data: existingSubscription, error: subscriptionCheckError } =
            await supabase
              .from("subscriptions")
              .select("*")
              .eq("user_id", userId)
              .eq("status", "active")
              .maybeSingle();

          if (subscriptionCheckError) {
            console.error(
              "Error checking subscription status:",
              subscriptionCheckError,
            );
          } else if (!existingSubscription) {
            console.log(
              "No active subscription found for owner, creating freemium subscription",
            );

            // Call the edge function to create a freemium subscription
            const { data: subscriptionData, error: subscriptionError } =
              await clientSupabase.functions.invoke(
                "supabase-functions-create-freemium-subscription",
                {
                  body: { user_id: userId, email: email },
                },
              );

            if (subscriptionError) {
              console.error(
                "Error creating freemium subscription:",
                subscriptionError,
              );
            } else {
              console.log(
                "Freemium subscription created successfully:",
                subscriptionData,
              );
            }
          } else {
            console.log(
              "User already has an active subscription:",
              existingSubscription.id,
            );
          }
        } catch (subscriptionErr) {
          console.error(
            "Exception during subscription check/creation:",
            subscriptionErr,
          );
          // Continue even if subscription creation fails
        }
      }

      return { success: true, created: true, user: insertedUser };
    }

    return { success: true, created: false };
  } catch (err: any) {
    console.error(
      "Unexpected error in ensureUserInPublicTable:",
      err.message || err,
    );
    return {
      success: false,
      error: err,
      message: "Unexpected error ensuring user exists",
    };
  }
};
