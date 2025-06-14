import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import {
  UserCircle,
  Users,
  Settings,
  BarChart3,
  CreditCard,
} from "lucide-react";
import UnifiedSidebar from "@/components/common/UnifiedSidebar";
import UnifiedTopbar from "@/components/common/UnifiedTopbar";
import { SubscriptionCheck } from "@/components/subscription-check";

export default async function AdminDashboard() {
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

  // Redirect if not admin
  if (!userData || userData.role !== "Administrator") {
    return redirect("/dashboard");
  }

  return (
    <SubscriptionCheck requiredRole="Administrator">
      <div className="flex">
        <UnifiedSidebar userRole="Administrator" variant="admin" />
        <div className="flex-1 transition-all duration-300">
          <UnifiedTopbar
            variant="dashboard"
            userRole="Administrator"
            userName={user.email}
          />
          <main className="w-full bg-gray-50 min-h-screen pl-0 md:pl-64 pt-16">
            <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
              {/* Header Section */}
              <header className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-blue-700">
                  Admin Dashboard
                </h1>
                <div className="bg-blue-50 text-sm p-3 px-4 rounded-lg text-blue-700 flex gap-2 items-center border border-blue-200">
                  <UserCircle size="14" />
                  <span>
                    Welcome to the Administrator dashboard. You have full access
                    to all system features.
                  </span>
                </div>
              </header>

              {/* Admin Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users size={24} className="text-blue-700" />
                    </div>
                    <h2 className="font-semibold text-lg">User Management</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Manage all platform users and their permissions
                  </p>
                  <div className="text-sm font-medium text-blue-700 cursor-pointer">
                    View Users →
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <BarChart3 size={24} className="text-green-700" />
                    </div>
                    <h2 className="font-semibold text-lg">Analytics</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    View platform usage statistics and reports
                  </p>
                  <div className="text-sm font-medium text-green-700 cursor-pointer">
                    View Analytics →
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Settings size={24} className="text-purple-700" />
                    </div>
                    <h2 className="font-semibold text-lg">System Settings</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Configure platform settings and preferences
                  </p>
                  <div className="text-sm font-medium text-purple-700 cursor-pointer">
                    Manage Settings →
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <CreditCard size={24} className="text-amber-700" />
                    </div>
                    <h2 className="font-semibold text-lg">Subscriptions</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Manage user subscriptions and payment plans
                  </p>
                  <div className="text-sm font-medium text-amber-700 cursor-pointer">
                    View Subscriptions →
                  </div>
                </div>
              </div>

              {/* Admin Data Section */}
              <section className="bg-white rounded-xl p-6 border shadow-sm">
                <h2 className="font-semibold text-xl mb-4">System Overview</h2>
                <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
                  <pre className="text-xs font-mono max-h-48 overflow-auto">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </SubscriptionCheck>
  );
}
