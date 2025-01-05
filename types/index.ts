/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@supabase/supabase-js";

export enum priority {
  low = "low",
  medium = "medium",
  high = "high",
  urgent = "urgent",
}
export interface Project {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  status: "planning" | "in_progress" | "on_hold" | "completed" | "cancelled";
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  picture_url: string | null;
}

export interface Ticket {
  id: string;
  project_id: string;
  created_by: any;
  assigned_to: any;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status:
    | "backlog"
    | "todo"
    | "in_progress"
    | "in_review"
    | "done"
    | "canceled";
  created_at: string;
  updated_at: string;
  labels: string[] | null;
  due_date: string | null;
  attachments?: any;
  attachments_count?: number;
  comments_count?: number;

  // Relationships
  project?: Project;
  assigned_to_user?: User | null;
  created_by_user?: User;
}

export type CreateTicketInput = Omit<
  Ticket,
  | "id"
  | "created_at"
  | "updated_at"
  | "project"
  | "assigned_to_user"
  | "created_by_user"
>;
