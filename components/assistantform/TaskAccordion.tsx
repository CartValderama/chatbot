import { Task } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2 } from "lucide-react";

interface TaskAccordionProps {
  tasks: Task[];
  openAccordions: string[];
  onOpenAccordionsChange: (value: string[]) => void;
  onUpdateTask: (index: number, field: keyof Task, value: string) => void;
  onRemoveTask: (index: number) => void;
}

export function TaskAccordion({
  tasks,
  openAccordions,
  onOpenAccordionsChange,
  onUpdateTask,
  onRemoveTask,
}: TaskAccordionProps) {
  const isTaskComplete = (task: Task) => {
    return task.name.trim() !== "" && task.time.trim() !== "";
  };

  return (
    <Accordion
      type="multiple"
      className="w-full space-y-2"
      value={openAccordions}
      onValueChange={onOpenAccordionsChange}
    >
      {tasks.map((task, index) => {
        const taskComplete = isTaskComplete(task);
        return (
          <AccordionItem
            key={`task-${index}`}
            value={`task-${index}`}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3 w-full">
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                    taskComplete
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {taskComplete ? "✓" : index + 1}
                </div>
                <div className="text-left flex-1">
                  <span className="font-medium">{task.name || "New Task"}</span>
                  {task.time && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      at {task.time}
                    </span>
                  )}
                  {task.priority === "high" && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Important
                    </span>
                  )}
                  {!taskComplete && (
                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      Incomplete
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 px-0.5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor={`task-name-${index}`}>Task Name *</Label>
                    <Input
                      id={`task-name-${index}`}
                      required
                      placeholder="e.g., Take medication"
                      value={task.name}
                      onChange={(e) =>
                        onUpdateTask(index, "name", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2 ">
                    <Label htmlFor={`task-time-${index}`}>Time *</Label>
                    <Input
                      id={`task-time-${index}`}
                      type="time"
                      required
                      value={task.time}
                      onChange={(e) =>
                        onUpdateTask(index, "time", e.target.value)
                      }
                      className="w-full cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`task-priority-${index}`}>Priority</Label>
                    <Select
                      value={task.priority || "normal"}
                      onValueChange={(value) =>
                        onUpdateTask(index, "priority", value)
                      }
                    >
                      <SelectTrigger id={`task-priority-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">Important</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`task-description-${index}`}>
                    Description (Optional)
                  </Label>
                  <Textarea
                    id={`task-description-${index}`}
                    placeholder="Add additional details about this task..."
                    rows={3}
                    value={task.description || ""}
                    onChange={(e) =>
                      onUpdateTask(index, "description", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-end justify-end gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveTask(index)}
                  >
                    <Trash2 />
                    <span className="hidden md:inline">Remove</span>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}

      {tasks.length === 0 && (
        <p className="text-sm text-muted-foreground px-0.5 py-4">
          No tasks added yet. Click &quot;Add Task&quot; to get started. At
          least one task is required.
        </p>
      )}
    </Accordion>
  );
}
