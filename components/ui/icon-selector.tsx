"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICON_OPTIONS } from "@/data/icons";
import { Icon } from "@iconify/react";
import { useState } from "react";

export const IconSelector = ({
  open,
  onOpenChange,
  onSelect,
  currentIcon,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (icon: string) => void;
  currentIcon: string;
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(ICON_OPTIONS.map((icon) => icon.category))),
  ];

  const filteredIcons = ICON_OPTIONS.filter((icon) => {
    const matchesSearch =
      icon.label.toLowerCase().includes(search.toLowerCase()) ||
      icon.value.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="dark:text-zinc-100">
            Choose an Icon
          </DialogTitle>
          <DialogDescription className="dark:text-zinc-400">
            Select an icon from the collection below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px] dark:bg-zinc-800 dark:text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-zinc-800">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {filteredIcons.map((icon) => (
              <button
                key={icon.value}
                onClick={() => onSelect(icon.value)}
                className={`p-4 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col items-center gap-2 ${
                  currentIcon === icon.value
                    ? "ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                <Icon
                  icon={icon.value}
                  className="w-6 h-6 dark:text-zinc-100"
                />
                <span className="text-xs text-center truncate w-full dark:text-zinc-300">
                  {icon.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
