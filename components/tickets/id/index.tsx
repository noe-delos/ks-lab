/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createTicketComment,
  getProjects,
  getUsers,
  updateTicketPriority,
  updateTicketStatus,
  uploadTicketAttachment,
} from "@/actions/tickets";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Project, Ticket } from "@/types";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  raw_user_meta_data?: {
    name?: string;
  };
}

const statusIcons: Record<Ticket["status"], { icon: string; color: string }> = {
  backlog: { icon: "lets-icons:progress", color: "text-zinc-400" },
  todo: { icon: "charm:circle", color: "text-zinc-600" },
  in_progress: { icon: "ri:progress-4-line", color: "text-yellow-500" },
  in_review: { icon: "ri:progress-5-line", color: "text-emerald-600" },
  done: { icon: "mdi:check-circle", color: "text-blue-600" },
  canceled: { icon: "mdi:close-circle", color: "text-red-500" },
};

const priorityIcons: Record<
  Ticket["priority"],
  { icon: string; color: string }
> = {
  low: { icon: "healthicons:low-bars", color: "text-emerald-600" },
  medium: { icon: "healthicons:medium-bars", color: "text-yellow-500" },
  high: { icon: "healthicons:high-bars", color: "text-orange-500" },
  urgent: { icon: "solar:danger-square-bold", color: "text-red-500" },
};

const metadataIcons = {
  project: "mdi:folder",
  createdBy: "mdi:account",
  createdAt: "mdi:calendar-clock",
  updatedAt: "mdi:update",
  dueDate: "mdi:calendar",
  assignedTo: "mdi:account-arrow-right",
};

interface Attachment {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  created_at: string;
  uploaded_by_user: {
    email: string;
    raw_user_meta_data?: {
      name?: string;
    };
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  created_by_user: User;
}

interface EnhancedTicket extends Ticket {
  project: Project;
  attachments: Attachment[];
  created_by_user?: any;
  assigned_to_user?: any;
}

interface TicketDetailLayoutProps {
  ticket: EnhancedTicket;
  comments: Comment[];
  theme: string;
  companyId: string;
}

const getUserDisplayName = (user?: any) => {
  if (!user) return "Non assigné";
  return user.full_name || user.email;
};

export function TicketDetailLayout({
  companyId,
  ticket: initialTicket,
  comments: initialComments,
  theme,
}: TicketDetailLayoutProps) {
  const router = useRouter();
  const [ticket, setTicket] = useState(initialTicket);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description || "");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    ticket.due_date ? new Date(ticket.due_date) : undefined
  );

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getUsers(companyId);
        setAvailableUsers(users as any);
      } catch (error) {
        console.error("Error loading users:", error);
        toast.error("Erreur lors du chargement des utilisateurs");
      }
    };

    const loadProjects = async () => {
      try {
        const projects = await getProjects();
        setAvailableProjects(projects);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast.error("Erreur lors du chargement des projets");
      }
    };

    loadUsers();
    loadProjects();
  }, []);

  const updateTicketField = async (field: string, value: any) => {
    try {
      const { error } = await supabaseAdmin
        .from("tickets")
        .update({ [field]: value })
        .eq("id", ticket.id);

      if (error) throw error;

      setTicket((prev) => ({ ...prev, [field]: value }));
      toast.success("Ticket mis à jour avec succès");
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Erreur lors de la mise à jour du ${field}`);
    }
  };

  const handleTitleBlur = async () => {
    if (title !== ticket.title) {
      await updateTicketField("title", title);
    }
  };

  const handleDescriptionBlur = async () => {
    if (description !== ticket.description) {
      await updateTicketField("description", description);
    }
  };

  const handleProjectChange = async (projectId: string) => {
    try {
      await updateTicketField("project_id", projectId);
      const newProject = availableProjects.find((p) => p.id === projectId);
      setTicket((prev) => ({ ...prev, project: newProject } as any));
      toast.success("Projet mis à jour avec succès");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Erreur lors de la mise à jour du projet");
    }
  };

  const handleAssigneeChange = async (userId: string) => {
    try {
      await updateTicketField("assigned_to", userId);
      const newAssignee = availableUsers.find((u) => u.id === userId);
      setTicket((prev) => ({ ...prev, assigned_to_user: newAssignee }));
      toast.success("Assignation mise à jour avec succès");
    } catch (error) {
      console.error("Error updating assignee:", error);
      toast.error("Erreur lors de la mise à jour de l'assignation");
    }
  };

  const handleDueDateChange = async (date: Date | undefined) => {
    try {
      await updateTicketField("due_date", date?.toISOString() || null);
      setSelectedDate(date);
      toast.success("Date d'échéance mise à jour avec succès");
    } catch (error) {
      console.error("Error updating due date:", error);
      toast.error("Erreur lors de la mise à jour de la date d'échéance");
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadingFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
  });

  const handleUploadFiles = async () => {
    try {
      setIsSubmitting(true);
      for (const file of uploadingFiles) {
        await uploadTicketAttachment(ticket.id, file);
      }
      toast.success("Fichiers ajoutés avec succès");
      setIsUploadModalOpen(false);
      setUploadingFiles([]);
      router.refresh();
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Erreur lors de l'ajout des fichiers");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const comment = await createTicketComment(ticket.id, newComment);
      setComments((prev) => [...prev, comment]);
      setNewComment("");
      toast.success("Commentaire ajouté avec succès");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: Ticket["status"]) => {
    try {
      await updateTicketStatus(ticket.id, newStatus);
      setTicket((prev) => ({ ...prev, status: newStatus }));
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handlePriorityChange = async (newPriority: Ticket["priority"]) => {
    try {
      await updateTicketPriority(ticket.id, newPriority);
      setTicket((prev) => ({ ...prev, priority: newPriority }));
      toast.success("Priorité mise à jour avec succès");
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("Erreur lors de la mise à jour de la priorité");
    }
  };

  const handleDownloadAttachment = async (
    fileUrl: string,
    fileName: string
  ) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Erreur lors du téléchargement du fichier");
    }
  };

  return (
    <>
      <div className="p-8">
        <div className="mb-0">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/dashboard/tickets")}
          >
            <Icon icon="mdi:arrow-left" className="mr-2 h-4 w-4" />
            Retour aux tickets
          </Button>

          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1 mt-10">
              <div className="space-y-2 ml-5">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  className="w-full bg-transparent text-2xl font-bold focus:outline-none"
                />

                {ticket.labels && ticket.labels.length > 0 && (
                  <div className="flex gap-2">
                    {ticket.labels.map((label) => (
                      <Badge key={label} variant="secondary">
                        {label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            {/* Description */}
            <div className="rounded-lg bg-white p-6">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                className="min-h-[100px] w-full resize-none bg-transparent focus:outline-none"
                placeholder="Ajouter une description..."
              />
            </div>

            {/* Comments section */}
            <div className="rounded-lg bg-white p-6">
              <h2 className="mb-4 text-lg font-medium">Commentaires</h2>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg bg-zinc-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {getUserDisplayName(
                              comment.created_by_user
                            )[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {getUserDisplayName(comment.created_by_user)}
                        </span>
                      </div>
                      <span className="text-sm text-zinc-500">
                        {format(new Date(comment.created_at), "PPP", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                    <p className="text-zinc-600">{comment.content}</p>
                  </div>
                ))}

                <form onSubmit={handleSubmitComment} className="mt-4 relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="min-h-[100px] w-full resize-none rounded-lg border p-3 pr-12 text-zinc-600 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-black p-0"
                  >
                    {isSubmitting ? (
                      <Icon
                        icon="mdi:loading"
                        className="h-4 w-4 animate-spin text-white"
                      />
                    ) : (
                      <Icon
                        icon="mdi:send"
                        className="h-4 w-4 ml-1 text-white"
                      />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Status, Priority, Project, Assignee, and Due Date section */}
            <div className="rounded-lg bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-500">Statut</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7">
                      <Icon
                        icon={statusIcons[ticket.status].icon}
                        className={`h-4 w-4 mr-2 ${
                          statusIcons[ticket.status].color
                        }`}
                      />
                      <span className="font-medium">
                        {ticket.status.charAt(0).toUpperCase() +
                          ticket.status.slice(1).replace("_", " ")}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44 p-1">
                    <div className="space-y-0.5">
                      {Object.entries(statusIcons).map(
                        ([status, { icon, color }]) => (
                          <Button
                            key={status}
                            variant="ghost"
                            className="w-full justify-start h-8"
                            onClick={() =>
                              handleStatusChange(status as Ticket["status"])
                            }
                          >
                            <Icon
                              icon={icon}
                              className={`h-4 w-4 mr-2 ${color}`}
                            />
                            {status.charAt(0).toUpperCase() +
                              status.slice(1).replace("_", " ")}
                          </Button>
                        )
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-500">Priorité</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7">
                      <Icon
                        icon={priorityIcons[ticket.priority].icon}
                        className={`h-4 w-4 mr-2 ${
                          priorityIcons[ticket.priority].color
                        }`}
                      />
                      <span className="font-medium">
                        {ticket.priority.charAt(0).toUpperCase() +
                          ticket.priority.slice(1)}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44 p-1">
                    <div className="space-y-0.5">
                      {Object.entries(priorityIcons).map(
                        ([priority, { icon, color }]) => (
                          <Button
                            key={priority}
                            variant="ghost"
                            className="w-full justify-start h-8"
                            onClick={() =>
                              handlePriorityChange(
                                priority as Ticket["priority"]
                              )
                            }
                          >
                            <Icon
                              icon={icon}
                              className={`h-4 w-4 mr-2 ${color}`}
                            />
                            {priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
                          </Button>
                        )
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-500">Projet</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7">
                      <Icon
                        icon={
                          ticket.project?.picture_url || metadataIcons.project
                        }
                        color={theme}
                        className="h-4 w-4 mr-2 text-zinc-500"
                      />
                      <span className="font-medium">
                        {ticket.project?.name || "Aucun projet"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-1">
                    <div className="space-y-0.5">
                      {availableProjects.map((project) => (
                        <Button
                          key={project.id}
                          variant="ghost"
                          className="w-full justify-start h-8"
                          onClick={() => handleProjectChange(project.id)}
                        >
                          <Icon
                            icon={project.picture_url || metadataIcons.project}
                            className="h-4 w-4 mr-2 text-zinc-500"
                            color={theme}
                          />
                          {project.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-500">Assigné à</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7">
                      <Icon
                        icon={metadataIcons.assignedTo}
                        className="h-4 w-4 mr-2 text-zinc-500"
                      />
                      <span className="font-medium">
                        {getUserDisplayName(ticket.assigned_to_user)}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-1">
                    <div className="space-y-0.5">
                      {availableUsers.map((user) => (
                        <Button
                          key={user.id}
                          variant="ghost"
                          className="w-full justify-start h-8"
                          onClick={() => handleAssigneeChange(user.id)}
                        >
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>
                              {getUserDisplayName(user)[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {getUserDisplayName(user)}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Date d'échéance</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7">
                      <Icon
                        icon={metadataIcons.dueDate}
                        className="h-4 w-4 mr-2 text-zinc-500"
                      />
                      <span className="font-medium">
                        {selectedDate
                          ? format(selectedDate, "PPP", { locale: fr })
                          : "Non définie"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDueDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Attachments section */}
            <div className="rounded-lg bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-medium">Pièces jointes</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Icon icon="mdi:plus" className="h-4 w-4" />
                </Button>
              </div>

              {ticket.attachments && ticket.attachments.length > 0 ? (
                <div className="space-y-2">
                  {ticket.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="mdi:file"
                          className="h-5 w-5 text-zinc-500"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {attachment.file_name}
                          </span>
                          <span className="text-xs text-zinc-500">
                            Ajouté par{" "}
                            {getUserDisplayName(attachment.uploaded_by_user)} le{" "}
                            {format(new Date(attachment.created_at), "PPP", {
                              locale: fr,
                            })}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDownloadAttachment(
                            attachment.file_url,
                            attachment.file_name
                          )
                        }
                      >
                        <Icon icon="mdi:download" className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500">Aucune pièce jointe</p>
              )}
            </div>

            {/* Metadata section */}
            <div className="rounded-lg bg-white p-4">
              <h2 className="mb-3 text-base font-medium">Informations</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Icon icon={metadataIcons.createdBy} className="h-4 w-4" />
                    Créé par
                  </span>
                  <span className="font-medium">
                    {getUserDisplayName(ticket.created_by_user)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Icon icon={metadataIcons.createdAt} className="h-4 w-4" />
                    Créé le
                  </span>
                  <span className="font-medium">
                    {format(new Date(ticket.created_at), "PPP", { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Icon icon={metadataIcons.updatedAt} className="h-4 w-4" />
                    Modifié le
                  </span>
                  <span className="font-medium">
                    {format(new Date(ticket.updated_at), "PPP", { locale: fr })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter des pièces jointes</DialogTitle>
          </DialogHeader>
          <div
            {...getRootProps()}
            className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <Icon
              icon="mdi:cloud-upload"
              className="mx-auto h-12 w-12 text-gray-400"
            />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? "Déposez les fichiers ici"
                : "Glissez-déposez des fichiers ici ou cliquez pour sélectionner"}
            </p>
          </div>

          {uploadingFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium">Fichiers à télécharger:</h3>
              {uploadingFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:file" className="h-5 w-5 text-zinc-500" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}

              <div className="mt-4 flex justify-end">
                <Button onClick={handleUploadFiles} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Icon
                      icon="mdi:loading"
                      className="mr-2 h-4 w-4 animate-spin"
                    />
                  ) : (
                    <Icon icon="mdi:cloud-upload" className="mr-2 h-4 w-4" />
                  )}
                  Télécharger
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
