import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Home,
  Building,
  Building2,
  Users,
  Briefcase,
} from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Real Estate
              </span>{" "}
              Platform
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              A modern, responsive real estate platform with subscription-based
              access for all your property needs. Connect buyers, owners,
              agencies, builders, and investors in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Get Started
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#pricing"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                View Pricing
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
              {[
                { icon: <Building className="w-6 h-6" />, label: "owner" },
                { icon: <Home className="w-6 h-6" />, label: "Buyer" },
                { icon: <Users className="w-6 h-6" />, label: "Agency" },
                { icon: <Building2 className="w-6 h-6" />, label: "Builder" },
                { icon: <Briefcase className="w-6 h-6" />, label: "Investor" },
              ].map((role, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-blue-600 mb-2">{role.icon}</div>
                  <span className="text-sm font-medium">{role.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Mobile-first design</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Role-based access</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Integrated messaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
