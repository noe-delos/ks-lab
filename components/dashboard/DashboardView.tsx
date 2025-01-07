/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import {
  UserProfile,
  getActivityData,
  getCompanyMeetings,
  getCompanyProjects,
  getCompanyUsers,
  type CompanyUser,
  type Meeting,
} from "@/actions/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { GripVertical, Ticket } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { CreateMeetingDialog } from "./CreateMeetingDialog";

interface Project {
  id: string;
  name: string;
  status: "planning" | "in_progress" | "on_hold" | "completed" | "cancelled";
  progress: number;
  icon: string;
  version: string;
}

const chartConfig: ChartConfig = {
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
};

function ActivityChart(profile: any) {
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchActivityData() {
      const data = await getActivityData(
        profile?.profile.company?.id as string
      );
      setChartData(data as any);
    }
    if (profile?.profile.company?.id) {
      fetchActivityData();
    }
  }, [profile]);

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
    </Card>
  );
}

function MeetingDialog({ meeting }: { meeting: Meeting }) {
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
              <Badge key={participant.id} variant="secondary">
                {participant.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <h4 className="font-medium">Description</h4>
          <p className="text-sm text-gray-500">{meeting.description}</p>
        </div>
        {meeting.files && meeting.files.length > 0 && (
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
        )}
      </div>
    </DialogContent>
  );
}

function UsersTable({ users }: { users: CompanyUser[] }) {
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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar_url} />
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
                {new Date(user.join_date).toLocaleDateString("fr-FR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MeetingsList({
  meetings,
  users,
}: {
  meetings: Meeting[];
  users: CompanyUser[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Réunions</h2>
        <CreateMeetingDialog users={users} />
      </div>
      <div className="space-y-2">
        {meetings.map((meeting) => (
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

function SortableProjectCard({
  project,
  theme,
}: {
  project: any;
  theme: string;
}) {
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
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex flex-col h-full">
            <div className="mb-auto">
              <div className="flex items-center gap-3 mb-3">
                {theme && (
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${theme}15` }}
                  >
                    <Icon
                      icon={project.picture_url}
                      className="w-6 h-6"
                      style={{ color: theme }}
                    />
                  </div>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-semibold text-lg truncate cursor-help">
                        {project.name}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">{project.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Progress value={project.progress} className="h-1.5" />
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{project.progress}%</span>
                  <div className="flex items-center gap-1">
                    <Ticket className="w-3 h-3" />
                    <span>{project.tickets[0]?.count || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <Badge variant="outline" className="text-xs">
                v{project.version || "1.0"}
              </Badge>
              <Badge
                variant={
                  project.status === "in_progress" ? "default" : "secondary"
                }
                className="text-xs"
              >
                {formatProjectStatus(project.status)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SortableTableRow({ project }: { project: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const projectIcon = getProjectIcon(project.status);

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
              icon={project.picture_url}
              className="w-5 h-5 text-gray-400 hover:text-gray-600"
            />
          </div>
          <Icon icon={projectIcon} className="w-5 h-5 text-blue-600" />
          <div className="font-semibold">{project.name}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={project.status === "in_progress" ? "default" : "secondary"}
        >
          {formatProjectStatus(project.status)}
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
  theme?: string;
}

function getProjectIcon(status: string): string {
  switch (status) {
    case "planning":
      return "solar:calendar-mark-bold-duotone";
    case "in_progress":
      return "solar:running-bold-duotone";
    case "on_hold":
      return "solar:pause-bold-duotone";
    case "completed":
      return "solar:check-circle-bold-duotone";
    case "cancelled":
      return "solar:close-circle-bold-duotone";
    default:
      return "solar:document-add-bold-duotone";
  }
}

function formatProjectStatus(status: string): string {
  switch (status) {
    case "planning":
      return "Planification";
    case "in_progress":
      return "En cours";
    case "on_hold":
      return "En pause";
    case "completed":
      return "Terminé";
    case "cancelled":
      return "Annulé";
    default:
      return status;
  }
}

export function ProjectsSection({
  theme,
  projects = [],
}: ProjectsSectionProps) {
  const [items, setItems] = React.useState(projects);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    setItems(projects);
  }, [projects]);

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
                  <SortableProjectCard
                    project={project}
                    theme={theme as string}
                  />
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (profile?.company?.id) {
        const [projectsData, usersData, meetingsData] = await Promise.all([
          getCompanyProjects(profile.company.id),
          getCompanyUsers(profile.company.id),
          getCompanyMeetings(profile.company.id),
        ]);

        setProjects(projectsData as any);
        setUsers(usersData);
        setMeetings(meetingsData);
      }
    }

    fetchDashboardData();
  }, [profile?.company?.id]);

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
        className="flex items-start gap-6 p-8 bg-white rounded-xl"
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
              <Badge
                className="rounded-full border border-blue-200 px-3 py-1"
                style={{
                  backgroundColor:
                    profile.company?.theme_color || "currentColor",
                  color: "white",
                }}
              >
                <Icon
                  icon="icon-park-solid:building-one"
                  className="w-4 h-4 mr-2"
                />
                {profile.company?.type || "Entreprise"}
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
          <ProjectsSection
            theme={profile?.company?.theme_color}
            projects={projects}
          />
        </motion.section>

        <motion.section
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ActivityChart profile={profile} />
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
          <UsersTable users={users} />
        </motion.section>

        <motion.section
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MeetingsList meetings={meetings} users={users} />
        </motion.section>
      </div>
    </motion.div>
  );
}
