import { createClient } from "../../supabase/client";
import {
  SupportRequest,
  SupportRequestResponse,
} from "@/models/SupportRequest";

const supabase = createClient();

/**
 * Fetch all support requests with optional filtering
 */
export const getSupportRequests = async (options?: {
  status?: string;
  priority?: string;
  limit?: number;
  offset?: number;
}) => {
  let query = supabase
    .from("support_requests")
    .select("*, users(name, email)")
    .order("created_at", { ascending: false });

  // Apply filters if provided
  if (options?.status) {
    query = query.eq("status", options.status);
  }

  if (options?.priority) {
    query = query.eq("priority", options.priority);
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
    console.error("Error fetching support requests:", error);
    throw error;
  }

  return data as SupportRequest[];
};

/**
 * Get a single support request by ID
 */
export const getSupportRequestById = async (id: string) => {
  const { data, error } = await supabase
    .from("support_requests")
    .select("*, users(name, email)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching support request:", error);
    throw error;
  }

  return data as SupportRequest;
};

/**
 * Create a new support request
 */
export const createSupportRequest = async (
  request: Omit<SupportRequest, "id" | "created_at" | "updated_at">,
) => {
  const { data, error } = await supabase
    .from("support_requests")
    .insert({
      user_id: request.user_id,
      subject: request.subject,
      message: request.message,
      priority: request.priority,
      status: "new",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating support request:", error);
    throw error;
  }

  return data as SupportRequest;
};

/**
 * Update a support request's status
 */
export const updateSupportRequestStatus = async (
  id: string,
  status: SupportRequest["status"],
) => {
  const { data, error } = await supabase
    .from("support_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating support request status:", error);
    throw error;
  }

  return data as SupportRequest;
};

/**
 * Add a response to a support request
 */
export const addSupportRequestResponse = async (
  response: Omit<SupportRequestResponse, "id" | "created_at">,
) => {
  const { data, error } = await supabase
    .from("support_request_responses")
    .insert({
      request_id: response.request_id,
      user_id: response.user_id,
      message: response.message,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding support request response:", error);
    throw error;
  }

  // Update the support request status to in_progress if it was new
  const { data: requestData } = await supabase
    .from("support_requests")
    .select("status")
    .eq("id", response.request_id)
    .single();

  if (requestData && requestData.status === "new") {
    await updateSupportRequestStatus(response.request_id, "in_progress");
  }

  return data as SupportRequestResponse;
};
