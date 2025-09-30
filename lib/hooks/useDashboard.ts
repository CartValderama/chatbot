import { useState, useMemo } from "react";
import { ChatbotConfig } from "../types/types";

export function useDashboard(chatbots: ChatbotConfig[]) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Filter and search chatbots
  const filteredChatbots = useMemo(() => {
    return chatbots.filter((chatbot) => {
      // Search filter - strict prefix match on assistant name (case-insensitive)
      const matchesSearch =
        searchQuery.trim() === "" ||
        chatbot.chatbotName.toLowerCase().startsWith(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [chatbots, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredChatbots.length / ITEMS_PER_PAGE);
  const paginatedChatbots = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredChatbots.slice(startIndex, endIndex);
  }, [filteredChatbots, currentPage]);

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return {
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
  };
}