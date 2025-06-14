import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper function to map old role names to new role names
function mapRole(role?: string): string {
  if (!role) return "comprador(a)";

  switch (role.toLowerCase()) {
    case "administrator":
      return "administrador";
    case "owner":
      return "proprietario(a)";
    case "buyer":
    case "builder":
    case "investor":
      return "comprador(a)";
    default:
      return role.toLowerCase();
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get all auth users
    const { data: authUsers, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      throw new Error(`Error fetching auth users: ${authError.message}`);
    }

    // Process each auth user
    const results = [];
    for (const user of authUsers.users) {
      // Check if user exists in public.users
      const { data: existingUser, error: userError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (userError && userError.code !== "PGRST116") {
        // PGRST116 is "not found"
        results.push({
          id: user.id,
          status: "error",
          message: userError.message,
        });
        continue;
      }

      if (!existingUser) {
        // Insert user into public.users
        const { error: insertError } = await supabaseAdmin
          .from("users")
          .insert({
            id: user.id,
            user_id: user.id,
            email: user.email,
            token_identifier: user.id,
            created_at: user.created_at,
            role: mapRole(user.user_metadata?.role || "comprador(a)"),
          });

        if (insertError) {
          results.push({
            id: user.id,
            status: "error",
            message: insertError.message,
          });
        } else {
          results.push({ id: user.id, status: "created" });
        }
      } else {
        // User already exists, update if needed
        const { error: updateError } = await supabaseAdmin
          .from("users")
          .update({
            email: user.email,
            role: mapRole(user.user_metadata?.role) || undefined,
          })
          .eq("id", user.id);

        if (updateError) {
          results.push({
            id: user.id,
            status: "error",
            message: updateError.message,
          });
        } else {
          results.push({ id: user.id, status: "updated" });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error syncing users:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
