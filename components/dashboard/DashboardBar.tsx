import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3x3, List, Plus } from "lucide-react";
import Link from "next/link";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
}

export function DashboardBar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assistants..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button asChild className="gap-0 p-2.5">
          <Link href="/form">
            <Plus className="md:mr-2 h-4 w-4" />
            <span className="hidden md:inline">Create Assistant</span>
          </Link>
        </Button>
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("grid")}
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "table" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("table")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
