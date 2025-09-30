import { ChatbotConfig } from "@/lib/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageSquare, Settings } from "lucide-react";

interface TableViewProps {
  chatbots: ChatbotConfig[];
}

export function TableView({ chatbots }: TableViewProps) {
  return (
    <Card className="rounded-md shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-4">Assistant Name</TableHead>
            <TableHead className="p-4">Tasks</TableHead>
            <TableHead className="p-4">Notes</TableHead>
            <TableHead className="text-right p-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chatbots.map((chatbot) => (
            <TableRow key={chatbot.id}>
              <TableCell className="font-medium capitalize p-4">
                {chatbot.chatbotName}
              </TableCell>
              <TableCell className="p-4">
                {chatbot.tasks.length}{" "}
                {chatbot.tasks.length === 1 ? "task" : "tasks"}
              </TableCell>
              <TableCell className="max-w-md p-4">
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  {chatbot.notes || "-"}
                </p>
              </TableCell>
              <TableCell className="text-right p-4">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/form?id=${chatbot.id}`}>
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline sm:ml-1">Edit</span>
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/chatbot?id=${chatbot.id}`}>
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline sm:ml-1">Chat</span>
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}