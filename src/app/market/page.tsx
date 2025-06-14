import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import UnifiedSidebar from "@/components/common/UnifiedSidebar";
import UnifiedTopbar from "@/components/common/UnifiedTopbar";
import MarketClient from "./MarketClient";

export default async function MarketPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user data including role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch all active properties from database
  const { data: properties, error: propertiesError } = await supabase
    .from("properties")
    .select(
      `
      *,
      users!properties_user_id_fkey(
        full_name,
        email
      )
    `,
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (propertiesError) {
    console.error("Error fetching properties:", propertiesError);
  }

  return (
    <SubscriptionCheck>
      <div className="flex">
        <UnifiedSidebar userRole={userData?.role || "Buyer"} />
        <div className="flex-1 transition-all duration-300">
          <UnifiedTopbar
            variant="dashboard"
            userRole={userData?.role || "Buyer"}
            userName={user.email}
          />
          <main className="w-full bg-gray-50 min-h-screen pl-0 md:pl-64 pt-16">
            <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="border-b border-gray-200 pb-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                      Mercado Imobiliário
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Descubra as melhores propriedades disponíveis
                    </p>
                  </div>
                </div>
              </div>

              {/* Market Client Component */}
              <MarketClient
                initialProperties={properties || []}
                currentUserId={user.id}
              />
            </div>
          </main>
        </div>
      </div>
    </SubscriptionCheck>
  );
}
