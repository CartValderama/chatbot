import { ChatbotConfig } from "@/lib/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Settings } from "lucide-react";

interface GridViewProps {
  chatbots: ChatbotConfig[];
}

export function GridView({ chatbots }: GridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {chatbots.map((chatbot) => (
        <Card key={chatbot.id} className="flex flex-col rounded-md shadow-sm">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-xl capitalize">
              {chatbot.chatbotName}
            </CardTitle>

            <CardDescription>
              {chatbot.tasks.length}{" "}
              {chatbot.tasks.length === 1 ? "task" : "tasks"}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 px-6">
            {chatbot.notes && (
              <div className="text-sm text-muted-foreground">
                <p className="line-clamp-2">{chatbot.notes}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="py-4 px-5 flex justify-between items-center gap-2">
            <Button variant="secondary" className="rounded-sm w-1/2" asChild>
              <Link href={`/form?id=${chatbot.id}`}>
                <Settings />
                <span className="capitalize">Configure</span>
              </Link>
            </Button>
            <Button className="rounded-sm w-1/2" asChild>
              <Link href={`/chatbot?id=${chatbot.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Open Chat
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
