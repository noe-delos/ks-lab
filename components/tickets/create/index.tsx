/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createTicket,
  getUsers,
  uploadTicketAttachment,
} from "@/actions/tickets";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Project } from "@/types";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateTicketForm } from "./use-create-ticket-form";

export function CreateTicketDialog({
  companyId,
  projects,
  theme,
  onTicketCreated,
}: {
  companyId: string;
  projects: Project[];
  theme: string;
  onTicketCreated?: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const form = useCreateTicketForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers(companyId);
        setUsers(usersData as any);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      if (data.due_date) {
        data.due_date = data.due_date.toISOString();
      }

      const ticket = await createTicket(data);

      if (selectedFiles.length > 0 && ticket?.id) {
        try {
          await Promise.all(
            selectedFiles.map((file) => uploadTicketAttachment(ticket.id, file))
          );
        } catch (uploadError) {
          console.error("Error uploading attachments:", uploadError);
        }
      }

      setOpen(false);
      if (onTicketCreated) {
        await onTicketCreated();
      }
      toast.success("Ticket créé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la création du ticket");
      console.error("Error creating ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button id="create-ticket-trigger" className="h-8 px-3">
          <Icon icon="mdi:plus" className="mr-2 h-4 w-4" />
          Créer un ticket
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Icon icon="solar:ticket-bold-duotone" className="h-5 w-5" />
            Nouveau ticket
          </AlertDialogTitle>
          <AlertDialogDescription>
            Remplissez les détails ci-dessous pour créer un nouveau ticket.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-6 py-4">
              <div className="flex gap-4 items-start">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <input
                          placeholder="Titre du ticket"
                          className="w-full text-xl font-bold focus:outline-none bg-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem className="w-fit">
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Sélectionner un projet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={project.id}
                              className="pl-2"
                            >
                              <div className="flex items-center gap-2 w-fit px-0">
                                {project.picture_url ? (
                                  <Icon
                                    icon={project.picture_url}
                                    color={theme}
                                    className="h-4 w-4"
                                  />
                                ) : (
                                  <Icon icon="mdi:folder" className="h-4 w-4" />
                                )}
                                {project.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        placeholder="Ajouter une description..."
                        className="w-full min-h-[100px] text-zinc-500 resize-none focus:outline-none bg-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue="medium"
                        >
                          <FormControl>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Priorité" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="healthicons:low-bars"
                                  className="h-4 w-4 text-emerald-600"
                                />
                                Basse
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="healthicons:medium-bars"
                                  className="h-4 w-4 text-yellow-500"
                                />
                                Moyenne
                              </div>
                            </SelectItem>
                            <SelectItem value="high">
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="healthicons:high-bars"
                                  className="h-4 w-4 text-orange-500"
                                />
                                Haute
                              </div>
                            </SelectItem>
                            <SelectItem value="urgent">
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="solar:danger-square-bold"
                                  className="h-4 w-4 text-red-500"
                                />
                                Urgente
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue="backlog"
                        >
                          <FormControl>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="backlog">
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="lets-icons:progress"
                                  className="h-4 w-4 text-zinc-400"
                                />
                                Backlog
                              </div>
                            </SelectItem>
                            <SelectItem value="todo">
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="charm:circle"
                                  className="h-4 w-4 text-zinc-600"
                                />
                                À faire
                              </div>
                            </SelectItem>
                            <SelectItem value="in_progress">
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="ri:progress-4-line"
                                  className="h-4 w-4 text-yellow-500"
                                />
                                En cours
                              </div>
                            </SelectItem>
                            <SelectItem value="in_review">
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="ri:progress-5-line"
                                  className="h-4 w-4 text-emerald-600"
                                />
                                En validation
                              </div>
                            </SelectItem>
                            <SelectItem value="done">
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="mdi:check-circle"
                                  className="h-4 w-4 text-blue-600"
                                />
                                Terminé
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assigned_to"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Assigner à" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-8 px-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Date d&apos;échéance</span>
                                )}
                                <Icon
                                  icon="mdi:calendar"
                                  className="ml-auto h-4 w-4 opacity-50"
                                />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              locale={fr}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon icon="gg:attachment" className="mr-2 h-4 w-4" />
                    Ajouter des pièces jointes
                  </Button>

                  {previews.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {previews.map((preview, index) => (
                        <div key={preview} className="relative">
                          <Image
                            src={preview}
                            alt="Aperçu"
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm hover:bg-gray-100"
                          >
                            <Icon icon="mdi:close" className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-8 px-3"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading} className="h-8 px-3">
                {loading ? (
                  <Icon
                    icon="mdi:loading"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                ) : (
                  <Icon icon="mdi:check" className="mr-2 h-4 w-4" />
                )}
                Créer le ticket
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
