/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import { UserProfile } from "@/actions/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface Project {
  id: string;
  name: string;
  status: "active" | "completed" | "pending";
  progress: number;
  icon: string;
  version: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Project Alpha",
    status: "active",
    progress: 75,
    icon: "solar:document-add-bold-duotone",
    version: "v1.2.0",
  },
  {
    id: "2",
    name: "Project Beta",
    status: "pending",
    progress: 30,
    icon: "solar:calendar-mark-bold-duotone",
    version: "v0.8.5",
  },
];

const chartData = [
  { month: "Jan", projects: 12, tickets: 45, members: 23 },
  { month: "Feb", projects: 19, tickets: 38, members: 28 },
  { month: "Mar", projects: 15, tickets: 42, members: 30 },
  { month: "Apr", projects: 21, tickets: 35, members: 35 },
  { month: "Mai", projects: 25, tickets: 30, members: 38 },
  { month: "Juin", projects: 30, tickets: 25, members: 42 },
];

const chartConfig: any = {
  projects: {
    label: "Projets",
    color: "hsl(210, 100%, 50%)",
  },
  tickets: {
    label: "Tickets",
    color: "hsl(210, 80%, 60%)",
  },
  members: {
    label: "Membres",
    color: "hsl(210, 60%, 70%)",
  },
} satisfies ChartConfig;

const mockUsers = [
  {
    id: "1",
    name: "Sophie Martin",
    email: "sophie.m@company.com",
    role: "Project Manager",
    status: "active",
    joinDate: "2024-01-15",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Thomas Bernard",
    email: "t.bernard@company.com",
    role: "Developer",
    status: "active",
    joinDate: "2024-02-01",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
];

const mockMeetings = [
  {
    id: "1",
    title: "Revue de Project Alpha",
    date: "2024-03-01T10:00:00",
    participants: ["Sophie Martin", "Thomas Bernard"],
    description: "Revue mensuelle du projet Alpha avec l'équipe",
    files: ["presentation.pdf", "rapport.docx"],
  },
  {
    id: "2",
    title: "Planning Sprint",
    date: "2024-03-02T14:30:00",
    participants: ["Sophie Martin"],
    description: "Planification du prochain sprint",
    files: ["backlog.xlsx"],
  },
];

function ActivityChart() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="pb-1">Activité</CardTitle>
          <CardDescription>
            Évolution des projets, tickets et membres
          </CardDescription>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange as any} />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={chartData}
              margin={{ left: 0, right: 20, top: 10, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              {Object.keys(chartConfig).map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="monotone"
                  fill={chartConfig[key].color}
                  fillOpacity={0.4}
                  stroke={chartConfig[key].color}
                  stackId="1"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              En hausse de 5.2% ce mois-ci <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Janvier - Juin 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

function MeetingDialog({ meeting }: { meeting: (typeof mockMeetings)[0] }) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{meeting.title}</DialogTitle>
        <DialogDescription>
          {new Date(meeting.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <h4 className="font-medium">Participants</h4>
          <div className="flex gap-2">
            {meeting.participants.map((participant) => (
              <Badge key={participant} variant="secondary">
                {participant}
              </Badge>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <h4 className="font-medium">Description</h4>
          <p className="text-sm text-gray-500">{meeting.description}</p>
        </div>
        <div className="grid gap-2">
          <h4 className="font-medium">Fichiers attachés</h4>
          <div className="flex flex-wrap gap-2">
            {meeting.files.map((file) => (
              <Badge key={file} variant="outline" className="cursor-pointer">
                <Icon
                  icon="material-symbols:file-present"
                  className="mr-1 w-4 h-4"
                />
                {file}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

function UsersTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date d'arrivée</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "active" ? "default" : "secondary"}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.joinDate).toLocaleDateString("fr-FR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MeetingsList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Réunions</h2>
        <Button
          onClick={() =>
            window.open("https://calendly.com/your-link", "_blank")
          }
          size="sm"
        >
          <Icon icon="material-symbols:add" className="mr-1 w-4 h-4" />
          Nouvelle réunion
        </Button>
      </div>
      <div className="space-y-2">
        {mockMeetings.map((meeting) => (
          <Dialog key={meeting.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{meeting.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(meeting.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {meeting.participants.length} participants
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <MeetingDialog meeting={meeting} />
          </Dialog>
        ))}
      </div>
    </div>
  );
}

function SortableProjectCard({ project }: { project: Project }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="bg-white border shadow-sm hover:shadow-md transition-shadow aspect-square">
        <CardContent className="p-4 relative h-full">
          <div
            {...listeners}
            className="absolute top-2 right-2 cursor-grab active:cursor-grabbing"
          >
            <Icon
              icon="material-symbols:drag-indicator"
              className="w-5 h-5 text-gray-400 hover:text-gray-600"
            />
          </div>

          <div className="flex flex-col h-full">
            <div className="mb-auto">
              <Icon
                icon={project.icon}
                className="w-8 h-8 text-blue-600 mb-3"
              />
              <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
              <Badge variant="outline" className="text-xs">
                {project.version}
              </Badge>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">{project.progress}%</div>
              <Badge
                variant={project.status === "active" ? "default" : "secondary"}
              >
                {project.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SortableTableRow({ project }: { project: Project }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b"
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div {...listeners} className="cursor-grab active:cursor-grabbing">
            <Icon
              icon="material-symbols:drag-indicator"
              className="w-5 h-5 text-gray-400 hover:text-gray-600"
            />
          </div>
          <Icon icon={project.icon} className="w-5 h-5 text-blue-600" />
          <div className="font-semibold">{project.name}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={project.status === "active" ? "default" : "secondary"}>
          {project.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {project.version}
        </Badge>
      </TableCell>
      <TableCell>{project.progress}%</TableCell>
    </motion.tr>
  );
}

interface ProjectsSectionProps {
  projects?: Project[];
}

export function ProjectsSection({
  projects = mockProjects,
}: ProjectsSectionProps) {
  const [items, setItems] = React.useState(projects);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs defaultValue="grid">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Projets</h2>
        <TabsList>
          <TabsTrigger value="grid">
            <Icon icon="material-symbols:grid-view" className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger value="list">
            <Icon icon="material-symbols:view-list" className="w-5 h-5" />
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="grid" className="mt-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto scrollbar-hide">
            <SortableContext items={items.map((p) => p.id)}>
              {items.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SortableProjectCard project={project} />
                </motion.div>
              ))}
            </SortableContext>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="bg-white border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors aspect-square flex items-center justify-center cursor-pointer">
                <div className="text-gray-400 hover:text-gray-500 transition-colors">
                  <Icon icon="material-symbols:add" className="w-8 h-8" />
                </div>
              </Card>
            </motion.div>
          </div>
        </DndContext>
      </TabsContent>

      <TabsContent value="list" className="mt-0">
        <Card>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projet</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Progrès</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext items={items.map((p) => p.id)}>
                  {items.map((project) => (
                    <SortableTableRow key={project.id} project={project} />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
export function DashboardView({ profile }: { profile: UserProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-8 space-y-8"
    >
      {/* Profile Section */}
      <motion.section
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        className="flex items-start gap-6 p-8 bg-white"
      >
        <div className="relative size-24">
          <div className="size-24 rounded-xl bg-gray-50 border-[1.5px] border-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src="/logo/brand-logo-white.png"
              alt="Brand logo"
              className="size-56 object-contain"
            />
          </div>
          {profile.company?.icon_url && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={profile.company.icon_url}
                alt={`${profile.company.name} logo`}
                width={80}
                height={80}
                className="rounded-full border-2 border-white shadow-sm"
              />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-medium">Votre espace</span>
            {profile.company?.name && (
              <span
                className="text-3xl font-bold"
                style={{ color: profile.company.theme_color || "currentColor" }}
              >
                {profile.company.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex gap-3">
              <Badge className="rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1">
                <Icon
                  icon="icon-park-solid:building-one"
                  className="w-4 h-4 mr-2"
                />
                {profile.company?.type || "Enterprise"}
              </Badge>
              <Badge className="rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-3 py-1">
                <Avatar className="w-4 h-4 mr-2">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>
                    {profile.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {profile.role || "Admin"}
              </Badge>
            </div>
            <span className="text-sm text-gray-500">
              Mis à jour le{" "}
              {new Date(
                profile.company?.updated_at || Date.now()
              ).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </motion.section>

      {/* Projects and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
        <motion.section
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-50 p-6 rounded-xl"
        >
          <ProjectsSection />
        </motion.section>

        <motion.section
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ActivityChart />
        </motion.section>
      </div>

      {/* Users and Meetings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.section
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">Utilisateurs</h2>
          <UsersTable />
        </motion.section>

        <motion.section
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MeetingsList />
        </motion.section>
      </div>
    </motion.div>
  );
}
