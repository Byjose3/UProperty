"use server";

import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import { UserRole } from "@/components/role-selection-form";
import { ensureUserInPublicTable } from "@/utils/auth";
import { supabase as clientSupabase } from "../../supabase/supabase";

/**
 * Handles user sign-up process
 * @param formData - Form data containing email, password, name, and role
 * @returns Redirect to success or error page
 */
export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const role = formData.get("role")?.toString() as UserRole | undefined;
  const nif = formData.get("nif")?.toString();
  const contact = formData.get("contact")?.toString();
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  if (!role) {
    return encodedRedirect("error", "/sign-up", "Please select a role");
  }

  // Map old role names to new role names if needed
  let normalizedRole: UserRole;
  switch (role.toLowerCase()) {
    case "administrator":
      normalizedRole = "administrador";
      break;
    case "owner":
    case "proprietario(a)":
    case "buyer":
    case "builder":
      normalizedRole = "comprador(a)";
      break;
    default:
      normalizedRole = "comprador(a)";
  }

  try {
    // Check if email already exists in auth.users
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    // Check if the email already exists in the users table
    if (existingUserError) {
      console.error("Error checking existing user:", existingUserError);
      return encodedRedirect(
        "error",
        "/sign-up",
        "An error occurred during sign up. Please try again.",
      );
    } else if (existingUser) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "An account with this email already exists. Please sign in instead.",
      );
    }

    // Proceed with sign up
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          email: email,
          role: normalizedRole,
          nif: nif || null,
          contact: contact || null,
        },
      },
    });

    if (error) {
      console.error("Sign-up error:", error.message, error.code);

      // Provide more specific error messages based on error code
      if (error.code === "user_already_exists") {
        return encodedRedirect(
          "error",
          "/sign-up",
          "An account with this email already exists. Please sign in instead.",
        );
      } else if (error.code === "invalid_email") {
        return encodedRedirect(
          "error",
          "/sign-up",
          "Please enter a valid email address.",
        );
      } else if (error.code === "weak_password") {
        return encodedRedirect(
          "error",
          "/sign-up",
          "Password is too weak. Please use a stronger password.",
        );
      } else {
        return encodedRedirect(
          "error",
          "/sign-up",
          `Sign-up error: ${error.message}`,
        );
      }
    }

    if (user) {
      try {
        // Use the ensureUserInPublicTable function instead of duplicating logic
        let syncResult;
        try {
          syncResult = await ensureUserInPublicTable(
            user.id,
            email,
            normalizedRole,
            { nif, contact },
          );

          if (!syncResult.success) {
            console.error(
              "Error ensuring user in public table:",
              syncResult.error,
            );
            return encodedRedirect(
              "error",
              "/sign-up",
              `Error creating user profile: ${syncResult.message || "Please try again."}`,
            );
          }
        } catch (syncError: any) {
          console.error("Exception during user sync:", syncError);
          // Continue with sign-up even if sync fails
        }

        console.log("User created successfully:", user.id, syncResult);

        // All users can have properties and sell, so create a freemium subscription for all
        if (normalizedRole === "comprador(a)") {
          // Check if the user already has an active subscription with retry logic
          let existingSubscription = null;
          let subscriptionCheckError = null;

          try {
            const result = await supabase
              .from("subscriptions")
              .select("*")
              .eq("user_id", user.id)
              .eq("status", "active")
              .maybeSingle();
            existingSubscription = result.data;
            subscriptionCheckError = result.error;
          } catch (dbError: any) {
            console.error(
              "Database error checking subscription during signup:",
              dbError.message,
            );
            subscriptionCheckError = dbError;
          }

          if (subscriptionCheckError) {
            console.error(
              "Error checking existing subscription:",
              subscriptionCheckError,
            );
          } else if (existingSubscription) {
            console.log(
              "User already has an active subscription:",
              existingSubscription.id,
            );
          } else {
            // Call the edge function to create a freemium subscription with retry
            let subscriptionData = null;
            let subscriptionError = null;
            let subRetryCount = 0;
            const maxSubRetries = 2;

            while (subRetryCount < maxSubRetries) {
              try {
                const result = await clientSupabase.functions.invoke(
                  "supabase-functions-create-freemium-subscription",
                  {
                    body: { user_id: user.id, email: email },
                  },
                );

                subscriptionData = result.data;
                subscriptionError = result.error;

                if (!subscriptionError) {
                  break;
                }

                subRetryCount++;
                if (subRetryCount < maxSubRetries) {
                  console.log(
                    `Subscription creation during signup attempt ${subRetryCount} failed, retrying...`,
                  );
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                }
              } catch (networkError: any) {
                console.error(
                  `Network error creating subscription during signup on attempt ${subRetryCount + 1}:`,
                  networkError.message,
                );
                subscriptionError = networkError;
                subRetryCount++;

                if (subRetryCount < maxSubRetries) {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                }
              }
            }

            if (subscriptionError) {
              console.error(
                "Error creating freemium subscription after retries:",
                subscriptionError,
              );
              // Continue with sign-up even if subscription creation fails
            } else {
              console.log(
                "Freemium subscription created successfully:",
                subscriptionData,
              );
            }
          }
        }
      } catch (err: any) {
        console.error("Error in user creation:", err);
        return encodedRedirect(
          "error",
          "/sign-up",
          `Error updating user: ${err.message || "Please try again."}`,
        );
      }
    }

    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  } catch (err: any) {
    console.error("Unexpected error during sign up:", err.message || err);
    return encodedRedirect(
      "error",
      "/sign-up",
      "An unexpected error occurred. Please try again.",
    );
  }
};

/**
 * Handles user sign-in and redirects to appropriate dashboard based on role
 * @param formData - Form data containing email and password
 * @returns Redirect to appropriate dashboard or error page
 */
export const signInAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();

  console.log("Attempting to sign in with:", email);

  if (!email || !password) {
    console.error("Missing email or password");
    return encodedRedirect(
      "error",
      "/sign-in",
      "Email and password are required",
    );
  }

  // Trim email and password to remove any accidental whitespace
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  try {
    // Attempt to sign in with trimmed values with retry logic
    let signInData = null;
    let signInError = null;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const result = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        signInData = result.data;
        signInError = result.error;

        if (!signInError) {
          break;
        }

        // Don't retry for authentication errors (invalid credentials, etc.)
        if (
          signInError.code === "invalid_credentials" ||
          signInError.code === "user_not_found" ||
          signInError.code === "invalid_grant"
        ) {
          break;
        }

        retryCount++;
        if (retryCount < maxRetries) {
          console.log(`Sign-in attempt ${retryCount} failed, retrying...`);
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount),
          );
        }
      } catch (networkError: any) {
        console.error(
          `Network error on sign-in attempt ${retryCount + 1}:`,
          networkError.message,
        );
        signInError = networkError;
        retryCount++;

        if (retryCount < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount),
          );
        }
      }
    }

    if (signInError) {
      console.error("Sign-in error:", signInError.message, signInError.code);

      // Handle network errors
      if (
        signInError.message?.includes("fetch failed") ||
        signInError.message?.includes("ENOTFOUND")
      ) {
        return encodedRedirect(
          "error",
          "/sign-in",
          "Network connection error. Please check your internet connection and try again.",
        );
      }

      // Provide more specific error messages based on error code
      if (signInError.code === "invalid_credentials") {
        return encodedRedirect(
          "error",
          "/sign-in",
          "Invalid email or password",
        );
      } else if (signInError.code === "user_not_found") {
        return encodedRedirect(
          "error",
          "/sign-in",
          "No account found with this email",
        );
      } else if (signInError.code === "invalid_grant") {
        return encodedRedirect(
          "error",
          "/sign-in",
          "Your account may be disabled or locked",
        );
      } else {
        return encodedRedirect(
          "error",
          "/sign-in",
          `Authentication error: ${signInError.message}`,
        );
      }
    }

    // Fetch user role from the database
    if (signInData?.user) {
      console.log("User authenticated successfully:", signInData.user.id);
      console.log(
        "User metadata:",
        JSON.stringify(signInData.user.user_metadata),
      );

      try {
        // Ensure user exists in public.users table with retry logic
        // Map old role names to new role names if needed
        let defaultRole = signInData.user.user_metadata?.role || "comprador(a)";
        if (defaultRole === "administrator") defaultRole = "administrador";
        if (["owner", "proprietario(a)", "buyer", "builder"].includes(defaultRole))
          defaultRole = "comprador(a)";

        let syncResult = null;
        let syncRetryCount = 0;
        const maxSyncRetries = 2;

        while (syncRetryCount < maxSyncRetries) {
          try {
            syncResult = await ensureUserInPublicTable(
              signInData.user.id,
              email,
              defaultRole,
            );

            if (syncResult && syncResult.success) {
              break;
            }

            syncRetryCount++;
            if (syncRetryCount < maxSyncRetries) {
              console.log(
                `User sync attempt ${syncRetryCount} failed, retrying...`,
              );
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          } catch (syncError: any) {
            console.error(
              `User sync error on attempt ${syncRetryCount + 1}:`,
              syncError.message,
            );
            syncRetryCount++;

            if (syncRetryCount >= maxSyncRetries) {
              syncResult = {
                success: false,
                error: syncError,
                message: "Failed to sync user after retries",
              };
            } else {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }

        console.log(
          "Sync result:",
          syncResult ? JSON.stringify(syncResult) : "null",
        );

        // Fetch the user data after ensuring it exists with retry logic
        let userData = null;
        let userError = null;
        let userRetryCount = 0;
        const maxUserRetries = 2;

        while (userRetryCount < maxUserRetries) {
          try {
            const result = await supabase
              .from("users")
              .select("*")
              .eq("id", signInData.user.id)
              .single();
            userData = result.data;
            userError = result.error;

            if (!userError) {
              break;
            }

            userRetryCount++;
            if (userRetryCount < maxUserRetries) {
              console.log(
                `User data fetch attempt ${userRetryCount} failed, retrying...`,
              );
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          } catch (dbError: any) {
            console.error(
              `Database error fetching user on attempt ${userRetryCount + 1}:`,
              dbError.message,
            );
            userError = dbError;
            userRetryCount++;

            if (userRetryCount < maxUserRetries) {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }
        }

        console.log(
          "User data from public.users:",
          userData ? JSON.stringify(userData) : "null",
        );

        if (userError) {
          console.error(
            "Error fetching user role after retries:",
            userError.message,
            userError.code,
          );
          // Continue even if there's an error fetching the role
          return redirect("/pricing");
        }

        // Check if user account is suspended or banned
        if (userData?.status === "suspended") {
          return encodedRedirect(
            "error",
            "/sign-in",
            "Your account has been suspended. Please contact support.",
          );
        }

        if (userData?.status === "banned") {
          return encodedRedirect(
            "error",
            "/sign-in",
            "Your account has been banned. Please contact support.",
          );
        }

        if (userData?.role) {
          console.log("User role found:", userData.role);
          // Normalize role to lowercase for consistency
          const normalizedRole = userData.role.toLowerCase() as UserRole;

          // Update user metadata with role information
          const { error: updateError } = await supabase.auth.updateUser({
            data: { role: normalizedRole },
          });

          if (updateError) {
            console.error("Error updating user metadata:", updateError.message);
          }

          // All users can have properties and sell, so check for freemium subscription
          if (normalizedRole === "comprador(a)") {
            try {
              // Check if the user already has an active subscription with retry logic
              let existingSubscription = null;
              let subscriptionCheckError = null;

              try {
                const result = await supabase
                  .from("subscriptions")
                  .select("*")
                  .eq("user_id", signInData.user.id)
                  .eq("status", "active")
                  .maybeSingle();
                existingSubscription = result.data;
                subscriptionCheckError = result.error;
              } catch (dbError: any) {
                console.error(
                  "Database error checking subscription:",
                  dbError.message,
                );
                subscriptionCheckError = dbError;
              }

              if (subscriptionCheckError) {
                console.error(
                  "Error checking subscription status:",
                  subscriptionCheckError,
                );
              } else if (!existingSubscription) {
                console.log(
                  "No active subscription found for owner, creating freemium subscription",
                );

                // Call the edge function to create a freemium subscription with retry
                let subscriptionData = null;
                let subscriptionError = null;
                let subRetryCount = 0;
                const maxSubRetries = 2;

                while (subRetryCount < maxSubRetries) {
                  try {
                    const result = await clientSupabase.functions.invoke(
                      "supabase-functions-create-freemium-subscription",
                      {
                        body: { user_id: signInData.user.id, email: email },
                      },
                    );

                    subscriptionData = result.data;
                    subscriptionError = result.error;

                    if (!subscriptionError) {
                      break;
                    }

                    subRetryCount++;
                    if (subRetryCount < maxSubRetries) {
                      console.log(
                        `Subscription creation attempt ${subRetryCount} failed, retrying...`,
                      );
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                  } catch (networkError: any) {
                    console.error(
                      `Network error creating subscription on attempt ${subRetryCount + 1}:`,
                      networkError.message,
                    );
                    subscriptionError = networkError;
                    subRetryCount++;

                    if (subRetryCount < maxSubRetries) {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                  }
                }

                if (subscriptionError) {
                  console.error(
                    "Error creating freemium subscription after retries:",
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
              // Continue with sign-in even if subscription creation fails
            }

            return redirect("/pricing");
          } else if (normalizedRole === "administrador") {
            return redirect("/dashboard/admin");
          }
        }

        // Default redirect if no specific role handling was triggered
        return redirect("/dashboard");
      } catch (syncError: any) {
        // Check if this is a Next.js redirect error, which is actually not an error
        if (syncError.message === "NEXT_REDIRECT") {
          // This is expected behavior when redirect() is called
          throw syncError; // Re-throw to let Next.js handle the redirect
        }

        console.error(
          "Error during user synchronization:",
          syncError.message || syncError,
        );
        // Even if sync fails, allow user to proceed to dashboard
        return redirect("/dashboard");
      }
    }

    // Fallback redirect
    return redirect("/dashboard");
  } catch (err: any) {
    // Check if this is a Next.js redirect error, which is actually not an error
    if (err.message === "NEXT_REDIRECT") {
      // This is expected behavior when redirect() is called
      throw err; // Re-throw to let Next.js handle the redirect
    }

    // Handle other specific errors
    if (err.message?.includes("getUserByEmail is not a function")) {
      console.error("Admin API not available in this context");
      return encodedRedirect(
        "error",
        "/sign-in",
        "Authentication service configuration error. Please contact support.",
      );
    }

    console.error("Unexpected error during sign in:", err.message || err);
    return encodedRedirect(
      "error",
      "/sign-in",
      "An unexpected error occurred. Please try again.",
    );
  }
};

/**
 * Handles forgot password request
 * @param formData - Form data containing email
 * @returns Redirect to success or error page
 */
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  try {
    const supabase = await createClient();

    // Check if the email exists in the system first
    let userData = null;
    let userError = null;

    try {
      const result = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      userData = result.data;
      userError = result.error;
    } catch (dbError: any) {
      console.error(
        "Database connection error during user check:",
        dbError.message,
      );
      // Continue with password reset attempt even if we can't check user existence
    }

    if (userError && userError.code !== "PGRST116") {
      console.error("Error checking user existence:", userError);
    } else if (!userData && !userError) {
      // Don't reveal that the email doesn't exist for security reasons
      // Instead, still show success message but don't actually send email
      console.log("Password reset requested for non-existent email:", email);
      return encodedRedirect(
        "success",
        "/forgot-password",
        "If an account exists with this email, you will receive a password reset link.",
      );
    }

    // Proceed with password reset with retry logic
    let resetError = null;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/reset-password`
          : `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/dashboard/reset-password`;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });

        if (!error) {
          resetError = null;
          break;
        }

        resetError = error;
        retryCount++;

        if (retryCount < maxRetries) {
          console.log(
            `Password reset attempt ${retryCount} failed, retrying...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount),
          ); // Exponential backoff
        }
      } catch (networkError: any) {
        console.error(
          `Network error on attempt ${retryCount + 1}:`,
          networkError.message,
        );
        resetError = networkError;
        retryCount++;

        if (retryCount < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount),
          );
        }
      }
    }

    if (resetError) {
      console.error("Password reset error after retries:", resetError);

      // Check if it's a network/connection error
      if (
        resetError.message?.includes("fetch failed") ||
        resetError.message?.includes("ENOTFOUND")
      ) {
        return encodedRedirect(
          "error",
          "/forgot-password",
          "Network connection error. Please check your internet connection and try again.",
        );
      }

      return encodedRedirect(
        "error",
        "/forgot-password",
        "Could not process password reset. Please try again later.",
      );
    }

    if (callbackUrl) {
      return redirect(callbackUrl);
    }

    return encodedRedirect(
      "success",
      "/forgot-password",
      "If an account exists with this email, you will receive a password reset link.",
    );
  } catch (err: any) {
    console.error(
      "Unexpected error during password reset:",
      err.message || err,
    );

    // Handle Next.js redirect errors
    if (err.message === "NEXT_REDIRECT") {
      throw err;
    }

    return encodedRedirect(
      "error",
      "/forgot-password",
      "An unexpected error occurred. Please try again.",
    );
  }
};

/**
 * Handles password reset
 * @param formData - Form data containing password and confirmPassword
 * @returns Redirect to success or error page
 */
export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  // Validate password strength
  if (password.length < 8) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password must be at least 8 characters long",
    );
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Password update error:", error);
      return encodedRedirect(
        "error",
        "/dashboard/reset-password",
        `Password update failed: ${error.message}`,
      );
    }

    // Get the current user to update their status if needed
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // If the user was previously suspended due to password issues, reactivate them
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("status")
        .eq("id", user.id)
        .single();

      if (!userError && userData?.status === "suspended") {
        // Reactivate the user
        await supabase
          .from("users")
          .update({
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      }
    }

    return encodedRedirect(
      "success",
      "/dashboard",
      "Password updated successfully",
    );
  } catch (err: any) {
    console.error(
      "Unexpected error during password reset:",
      err.message || err,
    );
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "An unexpected error occurred. Please try again.",
    );
  }
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error) {
    return false;
  }

  return !!subscription;
};

// User Management Actions
export const getUsersAction = async (options?: {
  role?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) => {
  const supabase = await createClient();

  let query = supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply filters if provided
  if (options?.role) {
    query = query.eq("role", options.role);
  }

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  // Apply pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return data;
};

export const updateUserStatusAction = async (
  userId: string,
  status: string,
) => {
  const supabase = await createClient();

  // Update the user status in the users table
  const { data, error } = await supabase
    .from("users")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user status:", error);
    throw error;
  }

  return data;
};

export const suspendUserAction = async (userId: string) => {
  return updateUserStatusAction(userId, "suspended");
};

export const activateUserAction = async (userId: string) => {
  return updateUserStatusAction(userId, "active");
};

export const banUserAction = async (userId: string) => {
  const supabase = await createClient();

  // First update the user status to banned
  const updatedUser = await updateUserStatusAction(userId, "banned");

  // Instead of trying to delete the user with admin API (which isn't available),
  // we'll just invalidate all sessions for this user
  const { error: authError } = await supabase.auth.signOut({
    scope: "global",
  });

  if (authError) {
    console.error("Error invalidating user sessions:", authError);
    // Continue anyway as we've already updated the status in the database
  }

  return updatedUser;
};
