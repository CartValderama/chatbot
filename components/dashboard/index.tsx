"use client";

import { ChatbotConfig } from "@/lib/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { GridView } from "./GridView";
import { TableView } from "./TableView";
import { Pagination } from "./Pagination";
import { useDashboard } from "@/lib/hooks/useDashboard";

interface DashboardProps {
  chatbots: ChatbotConfig[];
}

export default function Dashboard({ chatbots }: DashboardProps) {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    filteredChatbots,
    paginatedChatbots,
    totalPages,
    ITEMS_PER_PAGE,
  } = useDashboard(chatbots);

  if (chatbots.length === 0) {
    return (
      <div className="text-center py-12">
        <Card className="max-w-md mx-auto border-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle>No care assistants configured</CardTitle>
            <CardDescription>
              Create your first care assistant to get started.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/form">
                <Plus className="mr-2 h-4 w-4" />
                Create Assistant
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* No results message */}
      {filteredChatbots.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No assistants match your search criteria.
          </p>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && paginatedChatbots.length > 0 && (
        <div className="space-y-4">
          <GridView chatbots={paginatedChatbots} />

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredChatbots.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && paginatedChatbots.length > 0 && (
        <div className="space-y-4">
          <TableView chatbots={paginatedChatbots} />

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredChatbots.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
