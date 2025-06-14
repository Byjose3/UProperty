export interface SupportRequest {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high";
  status: "new" | "in_progress" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface SupportRequestResponse {
  id: string;
  request_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}
