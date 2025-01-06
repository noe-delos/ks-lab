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
import { Project, Ticket } from "@/types";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

// Import PDF viewer components
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { zoomPlugin } from "@react-pdf-viewer/zoom";

// Import document preview components
import { renderAsync } from "docx-preview";

// Import styles
import { IconSelector } from "@/components/ui/icon-selector";
import { cn } from "@/lib/utils";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import { format } from "date-fns";

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

// File type utilities
const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-excel": [".xls"],
};

const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "pdf";
    case "doc":
    case "docx":
      return "word";
    case "ppt":
    case "pptx":
      return "powerpoint";
    case "xls":
    case "xlsx":
      return "excel";
    default:
      return "unknown";
  }
};

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "pdf":
      return "mdi:file-pdf";
    case "word":
      return "mdi:file-word";
    case "powerpoint":
      return "mdi:file-powerpoint";
    case "excel":
      return "mdi:file-excel";
    default:
      return "mdi:file-document";
  }
};

const ProjectIconSelector = ({
  projectId,
  currentIcon,
  theme,
  onIconUpdate,
}: {
  projectId: string;
  currentIcon: string;
  theme: string;
  onIconUpdate: (newIcon: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIconSelect = async (selectedIcon: string) => {
    try {
      await updateProject(projectId, { picture_url: selectedIcon });
      onIconUpdate(selectedIcon);
      setIsOpen(false);
      toast.success("Project icon updated successfully");
    } catch (error) {
      console.error("Error updating project icon:", error);
      toast.error("Failed to update project icon");
    }
  };

  return (
    <div className="relative group">
      <div
        className="inline-block p-1 bg-gray-50 rounded-full relative group cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Icon
          icon={currentIcon || "mdi:home"}
          className="size-16"
          color={theme}
          style={{ fontSize: "5rem" }}
        />
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsOpen(true)}
        >
          <Icon icon="mdi:pencil" className="w-4 h-4" />
        </Button>
      </div>

      <IconSelector
        open={isOpen}
        onOpenChange={setIsOpen}
        onSelect={handleIconSelect}
        currentIcon={currentIcon || "mdi:home"}
      />
    </div>
  );
};

function DocumentPreview({ url, fileType }: { url: string; fileType: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDocument = async () => {
      if (!containerRef.current) return;

      if (fileType === "word") {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          await renderAsync(blob, containerRef.current, containerRef.current, {
            className: "docx-viewer",
          });
        } catch (error) {
          console.error("Error rendering Word document:", error);
        }
      }
    };

    loadDocument();
  }, [url, fileType]);

  if (fileType === "pdf") {
    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div style={{ height: "100%" }}>
          <Viewer
            fileUrl={url}
            plugins={[
              defaultLayoutPlugin(),
              pageNavigationPlugin(),
              zoomPlugin(),
            ]}
          />
        </div>
      </Worker>
    );
  }

  if (fileType === "word") {
    return <div ref={containerRef} className="h-full overflow-auto" />;
  }

  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <div className="text-center">
        <Icon icon={getFileIcon(fileType)} className="w-16 h-16 mx-auto mb-4" />
        <p>Preview not available for this file type.</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 mt-2 inline-block"
        >
          Download to view
        </a>
      </div>
    </div>
  );
}

interface TimelineEvent {
  id: string;
  title: string;
  event_date: string;
  icon: string;
  event_type: "milestone" | "update" | "delay" | "other";
}

interface ProjectTimelineProps {
  events: TimelineEvent[];
  theme: string;
}

function ProjectTimeline({ events, theme }: ProjectTimelineProps) {
  if (!events?.length) return null;

  const getGradientStyles = (color: string, isLast: boolean) => {
    const baseColor = color || "#3b82f6";
    const style = {
      "--timeline-color": baseColor,
      background: isLast
        ? `linear-gradient(180deg, ${baseColor}20 0%, ${baseColor}05 100%)`
        : `linear-gradient(180deg, #64748b15 0%, #64748b05 100%)`,
      border: isLast ? `2px solid ${baseColor}30` : "2px solid #64748b20",
    } as React.CSSProperties;

    return style;
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "milestone":
        return "mdi:flag-variant";
      case "delay":
        return "mdi:clock-alert";
      case "other":
        return "mdi:information";
      default:
        return "mdi:calendar-check";
    }
  };

  const itemWidth = "w-24"; // Consistent width for alignment

  return (
    <div className="relative max-w-5xl mx-auto flex flex-col justify-center items-center py-4 px-4 overflow-x-auto">
      {/* Top row: Squares and lines */}
      <div className="flex items-center min-w-max flex-col gap-4">
        <div className="flex flex-row">
          {events.map((event, index) => {
            const isLast = index === events.length - 1;
            const gradientStyles = getGradientStyles(theme, isLast);
            const icon = event.icon || getEventIcon(event.event_type);

            return (
              <div key={event.id} className="flex items-center">
                {/* Event box container - same width as badge container below */}
                <div className={cn("flex justify-center", itemWidth)}>
                  <div
                    style={gradientStyles}
                    className={cn(
                      "w-14 h-14 rounded-lg flex items-center justify-center",
                      "transition-all duration-300 ease-in-out",
                      "shadow-sm hover:shadow-md m-0 p-0"
                    )}
                  >
                    <Icon
                      icon={icon}
                      className={cn(
                        "w-6 h-6 transition-colors duration-300",
                        isLast ? `text-[${theme}]` : "text-gray-600"
                      )}
                      color={isLast ? theme : "#ADADAD"}
                    />
                  </div>
                </div>

                {/* Connecting line */}
                {!isLast && (
                  <div className="h-[3px] min-w-20 w-full bg-gray-100" />
                )}

                {/* Last item's dotted line */}
                {isLast && (
                  <div className="flex h-1 min-w-20 w-full">
                    <div className="h-[3px] w-1/2 bg-gray-100" />
                    <div className="ml-1 border-t-[4px] w-1/2 border-dashed border-gray-100" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-row w-full gap-8 mr-7">
          {events.map((event, index) => {
            const isLast = index === events.length - 1;

            return (
              <div key={`badge-${event.id}`} className="flex items-center">
                {/* Badge container - same width as square container above */}
                <div className={cn("flex flex-col items-center", itemWidth)}>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-sm text-xs font-medium whitespace-nowrap",
                      "transition-all duration-300",
                      isLast
                        ? `bg-[${theme}] text-white`
                        : "bg-gray-100 text-gray-700"
                    )}
                    style={{
                      backgroundColor: isLast ? theme : "",
                      opacity: isLast ? 0.6 : 1,
                    }}
                  >
                    {event.title}
                  </span>

                  <span className="text-[0.65rem] text-gray-500 mt-1 whitespace-nowrap">
                    {format(new Date(event.event_date), "MMM dd, yyyy")}
                  </span>
                </div>

                {/* Spacer to match the line width in top row */}
                <div className="w-12" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Badges and dates */}
      <div className="flex items-start min-w-max mt-3 bg-red-500"></div>
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
  const fileType = getFileType(attachment.file_name);

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
            <Icon
              icon={getFileIcon(fileType)}
              className={`w-6 h-6 ${
                fileType === "pdf"
                  ? "text-red-500"
                  : fileType === "word"
                  ? "text-blue-500"
                  : fileType === "powerpoint"
                  ? "text-orange-500"
                  : fileType === "excel"
                  ? "text-green-500"
                  : "text-gray-500"
              }`}
            />
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
            <DocumentPreview url={url} fileType={fileType} />
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
    accept: ACCEPTED_FILE_TYPES,
    disabled: uploading,
  });

  return (
    <div
      className={cn("space-y-6 ", attachments.length === 0 && "h-[18.5rem]")}
    >
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 h-full flex items-center justify-center
          transition-colors duration-200 ease-in-out
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-200"}
          ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <Icon
            icon={uploading ? "mdi:loading" : "solar:cloud-upload-bold-duotone"}
            className={`size-10 ${
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
              Supported formats: PDF, Word, PowerPoint, Excel
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
  const [pictureUrl, setPictureUrl] = useState(project.picture_url);

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

  const handleIconUpdate = (newIcon: string) => {
    setPictureUrl(newIcon);
  };

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
          <ProjectIconSelector
            projectId={project.id}
            currentIcon={pictureUrl || "mdi:home"}
            theme={theme}
            onIconUpdate={handleIconUpdate}
          />
        </div>

        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="text-4xl font-bold text-center bg-transparent focus:outline-none w-full mx-auto"
          style={{ caretColor: "auto" }}
        />

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => window.open("" || "#", "_blank")}
        >
          <Icon icon="mdi:external-link" className="w-4 h-4" />
          Access Project
        </Button>
      </div>

      <ProjectTimeline events={project.timeline_events} theme={theme} />

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
        <textarea
          value={description as string}
          onChange={handleDescriptionChange}
          className="w-full bg-transparent focus:outline-none min-h-[150px] resize-none"
          placeholder="Add a description..."
        />
      </div>
    </div>
  );
}
