"use client";

import { useSearchParams } from "next/navigation";
import { useChatbotStore } from "@/lib/stores/chatbot-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { TaskAccordion } from "./TaskAccordion";
import { DeleteDialog } from "./DeleteDialog";
import { useAssistantForm } from "../../lib/hooks/useAssistantForm";

function AssistantFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { getChatbot } = useChatbotStore();

  const existingChatbot = editId ? getChatbot(editId) : null;

  const {
    formData,
    setFormData,
    isSubmitting,
    showDeleteDialog,
    setShowDeleteDialog,
    openAccordions,
    setOpenAccordions,
    isButtonDisabled,
    handleSubmit,
    addTask,
    updateTask,
    removeTask,
    handleDelete,
  } = useAssistantForm(editId, existingChatbot);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {editId ? "Edit Care Assistant" : "Create Care Assistant"}
            </CardTitle>
            <CardDescription>
              Set up your daily task reminders and assistance settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Assistant Name */}
              <div className="space-y-2">
                <Label htmlFor="chatbotName">Assistant Name *</Label>
                <Input
                  id="chatbotName"
                  required
                  value={formData.chatbotName}
                  onChange={(e) =>
                    setFormData({ ...formData, chatbotName: e.target.value })
                  }
                  placeholder="e.g., Daily Care Assistant, Medicine Reminder"
                />
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Tasks List *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTask}
                    className="gap-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline sm:ml-2">Add Task</span>
                  </Button>
                </div>

                <TaskAccordion
                  tasks={formData.tasks}
                  openAccordions={openAccordions}
                  onOpenAccordionsChange={setOpenAccordions}
                  onUpdateTask={updateTask}
                  onRemoveTask={removeTask}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any additional information, preferences, or special instructions..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-between items-center">
                {editId ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete
                  </Button>
                ) : (
                  <div></div>
                )}
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isButtonDisabled}>
                    {isSubmitting ? "Saving..." : editId ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <DeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}

export default function AssistantForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssistantFormContent />
    </Suspense>
  );
}
