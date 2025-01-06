/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyUser, createMeeting } from '@/actions/dashboard';
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {  CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Icon } from "@iconify/react";

interface CreateMeetingDialogProps {
  users: CompanyUser[];
}

export function CreateMeetingDialog({ users }: CreateMeetingDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [selectedTime, setSelectedTime] = React.useState<string>("10:00");
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      files: [],
    },
  });

  async function onSubmit(data: any) {
    if (!selectedDate) return;

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    // Combine date and time
    const meetingDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":");
    meetingDate.setHours(parseInt(hours), parseInt(minutes));
    formData.append("date", meetingDate.toISOString());

    // Add selected participants
    selectedUsers.forEach((userId) => {
      formData.append("participants", userId);
    });

    // Add files (if you have file handling logic)
    data.files.forEach((file: File) => {
      formData.append("files", file);
    });

    const result = await createMeeting(formData);

    if (result.success) {
      setOpen(false);
      form.reset();
      setSelectedDate(undefined);
      setSelectedTime("10:00");
      setSelectedUsers([]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Icon icon="material-symbols:add" className="mr-1 w-4 h-4" />
          Nouvelle réunion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réunion</DialogTitle>
          <DialogDescription>
            Créez une nouvelle réunion et invitez des participants
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de la réunion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de la réunion"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <FormLabel>Heure</FormLabel>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'heure" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <React.Fragment key={hour}>
                        <SelectItem
                          value={`${hour.toString().padStart(2, "0")}:00`}
                        >
                          {`${hour.toString().padStart(2, "0")}:00`}
                        </SelectItem>
                        <SelectItem
                          value={`${hour.toString().padStart(2, "0")}:30`}
                        >
                          {`${hour.toString().padStart(2, "0")}:30`}
                        </SelectItem>
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Participants</FormLabel>
              <div className="grid gap-2">
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (!selectedUsers.includes(value)) {
                      setSelectedUsers([...selectedUsers, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ajouter des participants" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((user) => !selectedUsers.includes(user.id))
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user.avatar_url} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {user.name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((userId) => {
                    const user = users.find((u) => u.id === userId);
                    if (!user) return null;
                    return (
                      <Badge
                        key={userId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {user.name}
                        <button
                          type="button"
                          className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                          onClick={() =>
                            setSelectedUsers(
                              selectedUsers.filter((id) => id !== userId)
                            )
                          }
                        >
                          <Icon
                            icon="material-symbols:close"
                            className="h-3 w-3"
                          />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={!selectedDate || selectedUsers.length === 0}
              >
                Créer la réunion
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}