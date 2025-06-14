import { createClient } from "../../../supabase/server";
import {
  InfoIcon,
  UserCircle,
  Building,
  LineChart,
  Briefcase,
  Calendar,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import UnifiedSidebar from "@/components/common/UnifiedSidebar";
import UnifiedTopbar from "@/components/common/UnifiedTopbar";

export default async function BuilderDashboard() {
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

  // Redirect if not a builder
  if (userData?.role !== "Builder") {
    return redirect("/dashboard");
  }

  return (
    <SubscriptionCheck>
      <div className="flex">
        <UnifiedSidebar userRole="Builder" />
        <div className="flex-1 transition-all duration-300">
          <UnifiedTopbar
            variant="dashboard"
            userRole="Builder"
            userName={user.email}
          />
          <main className="w-full bg-gray-50 min-h-screen pl-0 md:pl-64 pt-16">
            <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
              {/* Header Section */}
              <header className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-blue-700">
                  Builder Dashboard
                </h1>
                <div className="bg-blue-50 text-sm p-3 px-4 rounded-lg text-blue-700 flex gap-2 items-center border border-blue-200">
                  <InfoIcon size="14" />
                  <span>
                    Welcome to your Builder dashboard. Access features specific
                    to construction and development projects.
                  </span>
                </div>
              </header>

              {/* Builder Dashboard Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building size={24} className="text-blue-700" />
                    </div>
                    <h2 className="font-semibold text-lg">Projects</h2>
                  </div>
                  <p className="text-gray-600">
                    Manage your construction projects
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Building size={24} className="text-green-700" />
                    </div>
                    <h2 className="font-semibold text-lg">Developments</h2>
                  </div>
                  <p className="text-gray-600">
                    Track your property developments
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <LineChart size={24} className="text-purple-700" />
                    </div>
                    <h2 className="font-semibold text-lg">Site Visits</h2>
                  </div>
                  <p className="text-gray-600">
                    Schedule and manage site visits
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <Calendar size={24} className="text-amber-700" />
                    </div>
                    <h2 className="font-semibold text-lg">Schedule</h2>
                  </div>
                  <p className="text-gray-600">
                    Manage construction timelines and schedules
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <Users size={24} className="text-red-700" />
                    </div>
                    <h2 className="font-semibold text-lg">Team</h2>
                  </div>
                  <p className="text-gray-600">
                    Manage your construction teams and contractors
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <Briefcase size={24} className="text-indigo-700" />
                    </div>
                    <h2 className="font-semibold text-lg">Resources</h2>
                  </div>
                  <p className="text-gray-600">
                    Manage construction materials and resources
                  </p>
                </div>
              </div>

              {/* User Profile Section */}
              <section className="bg-white rounded-xl p-6 border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <UserCircle size={48} className="text-blue-600" />
                  <div>
                    <h2 className="font-semibold text-xl">User Profile</h2>
                    <p className="text-sm text-gray-600">
                      {user.email} • Builder
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
                  <pre className="text-xs font-mono max-h-48 overflow-auto">
                    {JSON.stringify(userData || user, null, 2)}
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
