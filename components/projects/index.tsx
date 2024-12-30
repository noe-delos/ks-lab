/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  Grid,
  GripVertical,
  List,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export interface Project {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  status: "planning" | "in_progress" | "on_hold" | "completed" | "cancelled";
  start_date: string | null;
  end_date: string | null;
  picture_url: string | null;
  created_at: string;
  updated_at: string;
  position?: number;
}

interface ProjectsProps {
  initialProjects: Project[];
}

const STORAGE_KEY = "project-positions";

const statusTranslations = {
  planning: "En planification",
  in_progress: "En cours",
  on_hold: "En pause",
  completed: "Terminé",
  cancelled: "Annulé",
};

const SortableProjectCard = ({
  project,
  view,
}: {
  project: Project;
  view: "grid" | "list";
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
    transition: {
      duration: 150,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={view === "list" ? "mb-2" : ""}
    >
      <ProjectCard
        project={project}
        view={view}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </motion.div>
  );
};

const ProjectCard = ({
  project,
  view,
  dragHandleProps,
}: {
  project: Project;
  view: "grid" | "list";
  dragHandleProps?: any;
}) => {
  const router = useRouter();

  const statusColors = {
    planning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    in_progress: "bg-blue-100 text-blue-800 border border-blue-200",
    on_hold: "bg-orange-100 text-orange-800 border border-orange-200",
    completed: "bg-green-100 text-green-800 border border-green-200",
    cancelled: "bg-red-100 text-red-800 border border-red-200",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card
      className={`group relative cursor-pointer hover:shadow-md transition-all duration-200 ${
        view === "list" ? "mb-2" : "h-full"
      }`}
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <div
        {...dragHandleProps}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing" />
      </div>

      <CardHeader className="flex flex-row items-start gap-4 pt-3 pb-2">
        <div className="relative">
          <img
            src={project.picture_url || "/api/placeholder/32/32"}
            alt={project.name}
            className="w-12 h-12 rounded-lg object-cover shadow-sm"
          />
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              project.status === "completed"
                ? "bg-green-400"
                : project.status === "in_progress"
                ? "bg-blue-400"
                : project.status === "on_hold"
                ? "bg-orange-400"
                : project.status === "cancelled"
                ? "bg-red-400"
                : "bg-yellow-400"
            }`}
          />
        </div>
        <div className="flex-1 -mt-1">
          <CardTitle className="text-xl font-semibold line-clamp-1">
            {project.name}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                statusColors[project.status]
              }`}
            >
              {statusTranslations[project.status]}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {project.description}
        </p>

        <div className="flex items-center text-xs text-gray-500 space-x-2">
          {project.start_date && (
            <>
              <span className="font-medium">Début:</span>
              <span>{formatDate(project.start_date)}</span>
            </>
          )}
          {project.start_date && project.end_date && (
            <span className="text-gray-300">•</span>
          )}
          {project.end_date && (
            <>
              <span className="font-medium">Fin:</span>
              <span>{formatDate(project.end_date)}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Projects: React.FC<ProjectsProps> = ({ initialProjects }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    // Initialize projects with positions from localStorage or default order
    if (typeof window !== "undefined") {
      const storedPositions = localStorage.getItem(STORAGE_KEY);
      if (storedPositions) {
        const positions = JSON.parse(storedPositions);
        // Create a mapping of project IDs to their positions
        const positionMap = new Map(Object.entries(positions));

        // Sort projects based on stored positions or keep original order
        return initialProjects
          .map((project) => ({
            ...project,
            position: positionMap.has(project.id)
              ? positionMap.get(project.id)
              : initialProjects.findIndex((p) => p.id === project.id),
          }))
          .sort((a, b) => (a.position || 0) - (b.position || 0));
      }
    }
    // If no stored positions, assign default positions
    return initialProjects.map((project, index) => ({
      ...project,
      position: index,
    }));
  });

  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status" | "date">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update localStorage whenever projects change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const positions = projects.reduce(
        (acc, project, index) => ({
          ...acc,
          [project.id]: project.position || index,
        }),
        {}
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    }
  }, [projects]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Create new array with updated positions
        const reorderedItems = arrayMove(items, oldIndex, newIndex);

        // Update positions for all items
        return reorderedItems.map((item, index) => ({
          ...item,
          position: index,
        }));
      });
    }
  };

  const filteredAndSortedProjects = [...projects]
    .filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "status") {
        return sortDirection === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else {
        const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
        const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex gap-4 ml-auto">
            <Select
              value={sortBy}
              onValueChange={(value: "name" | "status" | "date") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="status">Statut</SelectItem>
                <SelectItem value="date">Date début</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
            >
              {sortDirection === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>

            <Tabs defaultValue="grid" className="w-[120px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid" onClick={() => setView("grid")}>
                  <Grid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" onClick={() => setView("list")}>
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredAndSortedProjects.map((p) => p.id)}
            strategy={
              view === "grid"
                ? rectSortingStrategy
                : verticalListSortingStrategy
            }
          >
            <motion.div
              layout
              className={
                view === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-2"
              }
            >
              {filteredAndSortedProjects.map((project) => (
                <SortableProjectCard
                  key={project.id}
                  project={project}
                  view={view}
                />
              ))}
            </motion.div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Projects;
