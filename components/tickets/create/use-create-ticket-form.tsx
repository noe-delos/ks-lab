// use-create-ticket-form.ts
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  project_id: z.string().min(1, "Le projet est requis"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z
    .enum(["backlog", "todo", "in_progress", "in_review", "done"])
    .default("backlog"),
  assigned_to: z.string().optional(),
  due_date: z.date().optional(),
  labels: z.array(z.string()).optional(),
});

export type TicketFormValues = z.infer<typeof formSchema>;

export function useCreateTicketForm() {
  return useForm<TicketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: "medium",
      status: "backlog",
      labels: [],
    },
  });
}
