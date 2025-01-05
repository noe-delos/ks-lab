/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateProject } from "@/actions/project";
import { getTickets } from "@/actions/tickets";
import { CreateTicketDialog } from "@/components/tickets/create";
import { TicketsList } from "@/components/tickets/list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Project, Ticket } from "@/types";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

// Import PDF viewer components
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { zoomPlugin } from "@react-pdf-viewer/zoom";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

interface ProjectDetailsProps {
  project: Project;
  theme: string;
}

interface Attachment {
  id: string;
  project_id: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

function ProjectTimeline({ events }: { events: any[] }) {
  if (!events?.length) return null;

  return (
    <div className="relative max-w-3xl mx-auto my-12 py-8 px-4">
      <div className="absolute left-1/2 transform -translate-x-1/2 h-1 w-full bg-gray-100 rounded top-12">
        <div
          className="h-full bg-blue-500 rounded transition-all duration-500"
          style={{
            width: `${
              (events.filter((e) => e.status === "completed").length /
                events.length) *
              100
            }%`,
          }}
        />
      </div>
      <div className="relative grid grid-cols-4">
        {events.map((event, i) => (
          <div key={i} className="flex flex-col items-center text-center px-2">
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                event.status === "completed"
                  ? "bg-blue-500 border-blue-600"
                  : "bg-white border-gray-300"
              }`}
            />
            <p className="text-sm font-medium mt-4 line-clamp-2">
              {event.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(event.event_date).toLocaleDateString("fr-FR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentViewer({
  attachment,
  onDelete,
}: {
  attachment: Attachment;
  onDelete?: () => void;
}) {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Initialize plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();

  useEffect(() => {
    const fetchUrl = async () => {
      console.log("Fetching signed URL for attachment:", attachment.file_path);
      try {
        const { data, error } = await supabaseAdmin.storage
          .from("project-attachments")
          .createSignedUrl(attachment.file_path, 3600);

        if (error) {
          console.error("Error creating signed URL:", error);
          throw error;
        }

        console.log("Signed URL created successfully:", data?.signedUrl);
        if (data?.signedUrl) {
          setUrl(data.signedUrl);
        }
      } catch (error) {
        console.error("Error fetching signed URL:", error);
        toast.error("Error loading document");
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, [attachment.file_path]);

  const handleDelete = async () => {
    console.log("Delete initiated for attachment:", attachment.id);
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        console.log("Deleting file from storage:", attachment.file_path);
        const { error: storageError } = await supabaseAdmin.storage
          .from("project-attachments")
          .remove([attachment.file_path]);

        if (storageError) {
          console.error("Storage deletion error:", storageError);
          throw storageError;
        }

        console.log("Deleting database record for attachment:", attachment.id);
        const { error: dbError } = await supabaseAdmin
          .from("project_attachments")
          .delete()
          .eq("id", attachment.id);

        if (dbError) {
          console.error("Database deletion error:", dbError);
          throw dbError;
        }

        console.log("Deletion successful");
        toast.success("Document deleted successfully");
        onDelete?.();
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Error deleting document");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group flex items-center justify-between p-3 bg-white rounded-lg border hover:border-blue-500 cursor-pointer transition-all">
          <div className="flex items-center gap-3">
            <Icon icon="mdi:file-pdf" className="w-6 h-6 text-red-500" />
            <div className="flex flex-col">
              <span className="font-medium group-hover:text-blue-600">
                {attachment.file_name}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(attachment.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100"
          >
            View
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{attachment.file_name}</span>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex-1 h-[calc(80vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Icon icon="mdi:loading" className="w-8 h-8 animate-spin" />
            </div>
          ) : url ? (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <div style={{ height: "100%" }}>
                <Viewer
                  fileUrl={url}
                  plugins={[
                    defaultLayoutPluginInstance,
                    pageNavigationPluginInstance,
                    zoomPluginInstance,
                  ]}
                />
              </div>
            </Worker>
          ) : (
            <div className="flex items-center justify-center h-full text-red-500">
              Error loading document
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DocumentsDrop({ projectId }: { projectId: string }) {
  console.log("DocumentsDrop initialized with projectId:", projectId);
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const fetchAttachments = async () => {
    console.log("Fetching attachments for project:", projectId);
    try {
      const { data, error } = await supabaseAdmin
        .from("project_attachments")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching attachments:", error);
        throw error;
      }

      console.log("Attachments fetched successfully:", data);
      setAttachments(data || []);
    } catch (error) {
      console.error("Error fetching attachments:", error);
      toast.error("Error loading attachments");
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [projectId]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log("Files dropped:", acceptedFiles);
      setUploading(true);
      try {
        for (const file of acceptedFiles) {
          console.log("Processing file:", file.name);
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
          const filePath = `${projectId}/${fileName}`;

          console.log("Uploading file to storage:", filePath);
          const { error: uploadError } = await supabaseAdmin.storage
            .from("project-attachments")
            .upload(filePath, file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            throw uploadError;
          }

          console.log("Creating attachment record in database");
          const { error: dbError } = await supabaseAdmin
            .from("project_attachments")
            .insert({
              project_id: projectId,
              file_name: file.name,
              file_path: filePath,
            });

          if (dbError) {
            console.error("Database error:", dbError);
            throw dbError;
          }
        }

        console.log("All files processed successfully");
        toast.success("Files uploaded successfully");
        fetchAttachments();
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Error uploading files");
      } finally {
        setUploading(false);
      }
    },
    [projectId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    disabled: uploading,
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8
          transition-colors duration-200 ease-in-out
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <Icon
            icon={uploading ? "mdi:loading" : "mdi:cloud-upload-outline"}
            className={`w-12 h-12 ${
              isDragActive ? "text-blue-500" : "text-gray-400"
            } ${uploading ? "animate-spin" : ""}`}
          />
          <div className="text-center">
            <p className="text-lg font-medium">
              {uploading
                ? "Uploading..."
                : isDragActive
                ? "Drop files here"
                : "Drag and drop files here"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to select files
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {attachments.map((attachment) => (
          <DocumentViewer
            key={attachment.id}
            attachment={attachment}
            onDelete={fetchAttachments}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetails({
  project,
  theme,
}: ProjectDetailsProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [tickets, setTickets] = useState<Ticket[]>(project.tickets || []);

  const refreshTickets = useCallback(async () => {
    try {
      const updatedTickets = await getTickets([project.id]);
      const projectTickets = updatedTickets.filter(
        (ticket) => ticket.project_id === project.id
      );
      setTickets(projectTickets);
    } catch (error) {
      console.error("Error refreshing tickets:", error);
      toast.error("Error refreshing tickets");
    }
  }, [project.id]);

  useEffect(() => {
    setTickets(project.tickets || []);
  }, [project.tickets]);

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    try {
      await updateProject(project.id, { name: newName });
    } catch (error) {
      toast.error("Error updating project");
      console.error("Error updating project:", error);
    }
  };

  const handleDescriptionChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    try {
      await updateProject(project.id, { description: newDescription });
    } catch (error) {
      toast.error("Error updating project");
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-12">
      <div className="text-center space-y-8">
        <div className="inline-block p-6 bg-gray-50 rounded-full">
          <Icon
            icon={project.picture_url || "mdi:home"}
            className="w-20 h-20"
            color={theme}
            style={{ fontSize: "5rem" }}
          />
        </div>

        <Input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="text-4xl font-bold text-center bg-transparent focus:outline-none w-full mx-auto"
          style={{ caretColor: "auto" }}
        />

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => window.open(project.url || "#", "_blank")}
        >
          <Icon icon="mdi:external-link" className="w-4 h-4" />
          Access Project
        </Button>
      </div>

      <ProjectTimeline events={project.timeline_events} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-xl border p-6 shadow-sm bg-white h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Tickets</h2>
            <CreateTicketDialog
              projects={[project]}
              theme={theme}
              onTicketCreated={refreshTickets}
              companyId={project.company_id}
            />
          </div>
          <TicketsList
            tickets={tickets}
            onDataChange={refreshTickets}
            listClassname="max-h-[15rem] pb-4"
          />
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Documents</h2>
          <DocumentsDrop projectId={project.id} />
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Description</h2>
        <Textarea
          value={description as string}
          onChange={handleDescriptionChange}
          className="w-full bg-transparent focus:outline-none min-h-[150px] resize-none"
          placeholder="Add a description..."
        />
      </div>
    </div>
  );
}
