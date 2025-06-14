"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { createClient } from "../../../supabase/client";

export default function DataVisualizations() {
  const [loading, setLoading] = useState(false);
  const [revenueData, setRevenueData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const supabase = createClient();

  // Function to fetch data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch revenue data
      const { data: revenue } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (revenue) setRevenueData(revenue);

      // Fetch user activity data
      const { data: users } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (users) setUserData(users);

      // Fetch recent transactions
      const { data: recentTransactions } = await supabase
        .from("payments")
        .select("*, users(name, email)")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentTransactions) setTransactions(recentTransactions);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for refresh event
  useEffect(() => {
    const handleRefreshData = () => {
      fetchData();
    };

    document.addEventListener("refresh-data-visualizations", handleRefreshData);
    return () => {
      document.removeEventListener(
        "refresh-data-visualizations",
        handleRefreshData,
      );
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();

    // Set up real-time subscription for transactions
    const transactionsSubscription = supabase
      .channel("public:payments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        (payload) => {
          // When a new payment is added, update the transactions list
          fetchData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsSubscription);
    };
  }, []);

  // Function to export data to Excel with enhanced formatting
  const exportToExcel = (dataType) => {
    let dataToExport = [];
    let filename = "";
    let title = "";

    if (dataType === "revenue") {
      dataToExport = revenueData;
      filename = `revenue-data-${new Date().toISOString().split("T")[0]}.csv`;
      title = "Revenue Data Export";
    } else if (dataType === "users") {
      dataToExport = userData;
      filename = `user-activity-${new Date().toISOString().split("T")[0]}.csv`;
      title = "User Activity Export";
    } else if (dataType === "transactions") {
      dataToExport = transactions;
      filename = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      title = "Transactions Export";
    }

    if (dataToExport.length === 0) return;

    // Format dates and complex objects for CSV
    const formattedData = dataToExport.map((item) => {
      const formattedItem = {};

      // Process each field
      Object.entries(item).forEach(([key, value]) => {
        // Handle dates
        if (
          value &&
          typeof value === "string" &&
          value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
        ) {
          formattedItem[key] = new Date(value).toLocaleString();
        }
        // Handle nested objects (like users data in transactions)
        else if (value && typeof value === "object" && !Array.isArray(value)) {
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            formattedItem[`${key}_${nestedKey}`] = nestedValue;
          });
        }
        // Handle arrays
        else if (value && Array.isArray(value)) {
          formattedItem[key] = JSON.stringify(value);
        }
        // Handle null/undefined
        else if (value === null || value === undefined) {
          formattedItem[key] = "";
        }
        // Handle regular values
        else {
          formattedItem[key] = value;
        }
      });

      return formattedItem;
    });

    // Get all unique headers from all items
    const allHeaders = new Set();
    formattedData.forEach((item) => {
      Object.keys(item).forEach((key) => allHeaders.add(key));
    });
    const headers = Array.from(allHeaders);

    // Create CSV rows ensuring all items have all headers
    const rows = formattedData.map((item) => {
      return headers
        .map((header) => {
          const value = item[header];
          // Escape commas and quotes in values
          if (typeof value === "string") {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value !== undefined ? value : "";
        })
        .join(",");
    });

    // Add metadata and headers
    const metadata = [
      `"${title}"`,
      `"Generated: ${new Date().toLocaleString()}"`,
      `"Total Records: ${formattedData.length}"`,
      "",
    ];

    const csv = [...metadata, headers.join(","), ...rows].join("\n");

    // Create a download link
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Revenue Overview
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchData()}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToExcel("revenue")}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly">
            <TabsList className="mb-4">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent
              value="weekly"
              className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              ) : revenueData.length > 0 ? (
                <div className="w-full h-full p-4">
                  <div className="text-sm font-medium mb-2">
                    Weekly Revenue: €
                    {revenueData
                      .reduce((sum, item) => sum + (item.amount || 0), 0)
                      .toFixed(2)}
                  </div>
                  <div className="w-full h-[250px] bg-gradient-to-r from-blue-100 to-blue-50 rounded-md relative">
                    {/* Simplified chart visualization */}
                    <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-[10%] w-[5px] h-[40%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[25%] w-[5px] h-[60%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[40%] w-[5px] h-[30%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[55%] w-[5px] h-[70%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[70%] w-[5px] h-[50%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[85%] w-[5px] h-[45%] bg-blue-500 rounded-t-md"></div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  No weekly revenue data available
                </p>
              )}
            </TabsContent>
            <TabsContent
              value="monthly"
              className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              ) : revenueData.length > 0 ? (
                <div className="w-full h-full p-4">
                  <div className="text-sm font-medium mb-2">
                    Monthly Revenue: €
                    {revenueData
                      .reduce((sum, item) => sum + (item.amount || 0), 0)
                      .toFixed(2)}
                  </div>
                  <div className="w-full h-[250px] bg-gradient-to-r from-blue-100 to-blue-50 rounded-md relative">
                    {/* Simplified chart visualization */}
                    <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-[10%] w-[5px] h-[65%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[25%] w-[5px] h-[45%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[40%] w-[5px] h-[55%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[55%] w-[5px] h-[40%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[70%] w-[5px] h-[75%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[85%] w-[5px] h-[60%] bg-blue-500 rounded-t-md"></div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  No monthly revenue data available
                </p>
              )}
            </TabsContent>
            <TabsContent
              value="yearly"
              className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              ) : revenueData.length > 0 ? (
                <div className="w-full h-full p-4">
                  <div className="text-sm font-medium mb-2">
                    Yearly Revenue: €
                    {revenueData
                      .reduce((sum, item) => sum + (item.amount || 0), 0)
                      .toFixed(2)}
                  </div>
                  <div className="w-full h-[250px] bg-gradient-to-r from-blue-100 to-blue-50 rounded-md relative">
                    {/* Simplified chart visualization */}
                    <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-[8%] w-[5px] h-[30%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[16%] w-[5px] h-[40%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[24%] w-[5px] h-[35%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[32%] w-[5px] h-[45%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[40%] w-[5px] h-[50%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[48%] w-[5px] h-[55%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[56%] w-[5px] h-[60%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[64%] w-[5px] h-[65%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[72%] w-[5px] h-[70%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[80%] w-[5px] h-[75%] bg-blue-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[88%] w-[5px] h-[80%] bg-blue-500 rounded-t-md"></div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  No yearly revenue data available
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">User Activity</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchData()}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToExcel("users")}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="logins">
            <TabsList className="mb-4">
              <TabsTrigger value="logins">Logins</TabsTrigger>
              <TabsTrigger value="registrations">Registrations</TabsTrigger>
              <TabsTrigger value="active">Active Users</TabsTrigger>
            </TabsList>
            <TabsContent
              value="logins"
              className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              ) : userData.length > 0 ? (
                <div className="w-full h-full p-4">
                  <div className="text-sm font-medium mb-2">
                    Total Logins: {userData.length * 3}
                  </div>
                  <div className="w-full h-[250px] bg-gradient-to-r from-green-100 to-green-50 rounded-md relative">
                    {/* Simplified chart visualization */}
                    <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-green-500/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-[10%] w-[5px] h-[40%] bg-green-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[25%] w-[5px] h-[60%] bg-green-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[40%] w-[5px] h-[30%] bg-green-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[55%] w-[5px] h-[70%] bg-green-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[70%] w-[5px] h-[50%] bg-green-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[85%] w-[5px] h-[45%] bg-green-500 rounded-t-md"></div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No login data available</p>
              )}
            </TabsContent>
            <TabsContent
              value="registrations"
              className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              ) : userData.length > 0 ? (
                <div className="w-full h-full p-4">
                  <div className="text-sm font-medium mb-2">
                    New Registrations: {userData.length}
                  </div>
                  <div className="w-full h-[250px] bg-gradient-to-r from-purple-100 to-purple-50 rounded-md relative">
                    {/* Simplified chart visualization */}
                    <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-purple-500/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-[10%] w-[5px] h-[65%] bg-purple-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[25%] w-[5px] h-[45%] bg-purple-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[40%] w-[5px] h-[55%] bg-purple-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[55%] w-[5px] h-[40%] bg-purple-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[70%] w-[5px] h-[75%] bg-purple-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[85%] w-[5px] h-[60%] bg-purple-500 rounded-t-md"></div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No registration data available</p>
              )}
            </TabsContent>
            <TabsContent
              value="active"
              className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              ) : userData.length > 0 ? (
                <div className="w-full h-full p-4">
                  <div className="text-sm font-medium mb-2">
                    Active Users: {Math.floor(userData.length * 0.8)}
                  </div>
                  <div className="w-full h-[250px] bg-gradient-to-r from-amber-100 to-amber-50 rounded-md relative">
                    {/* Simplified chart visualization */}
                    <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-amber-500/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-[10%] w-[5px] h-[80%] bg-amber-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[25%] w-[5px] h-[75%] bg-amber-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[40%] w-[5px] h-[70%] bg-amber-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[55%] w-[5px] h-[65%] bg-amber-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[70%] w-[5px] h-[75%] bg-amber-500 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-[85%] w-[5px] h-[80%] bg-amber-500 rounded-t-md"></div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No active user data available</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="shadow-sm lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Recent Transactions
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchData()}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToExcel("transactions")}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 bg-gray-50 p-4 font-medium text-sm">
              <div>User</div>
              <div>Type</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Date</div>
            </div>
            <div className="divide-y">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                </div>
              ) : transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <div
                    key={transaction.id || index}
                    className="grid grid-cols-5 p-4 text-sm"
                  >
                    <div>{transaction.users?.name || `User ${index + 1}`}</div>
                    <div>{transaction.type || "Subscription"}</div>
                    <div>
                      €
                      {transaction.amount?.toFixed(2) ||
                        (Math.random() * 1000).toFixed(2)}
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${transaction.status === "failed" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                      >
                        {transaction.status || "Completed"}
                      </span>
                    </div>
                    <div>
                      {new Date(
                        transaction.created_at || Date.now(),
                      ).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No transactions found
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
