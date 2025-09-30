import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChatbotStore } from "@/lib/stores/chatbot-store";
import { useToast } from "@/lib/hooks/useToast";
import { Task } from "@/lib/types/types";

export function useAssistantForm(editId: string | null, existingChatbot: any) {
  const router = useRouter();
  const { toast } = useToast();
  const { addChatbot, updateChatbot, deleteChatbot } = useChatbotStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    chatbotName: existingChatbot?.chatbotName || "",
    tasks:
      existingChatbot?.tasks.map((task: Task) => ({
        ...task,
        isSaved: true,
      })) || [],
    notes: existingChatbot?.notes || "",
  });
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validTasks = formData.tasks.filter(
      (task: Task) => task.name.trim() && task.time.trim()
    );

    if (validTasks.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please add at least one task with a name and time.",
      });
      setIsSubmitting(false);
      return;
    }

    const chatbotData = {
      chatbotName: formData.chatbotName.trim(),
      tasks: validTasks,
      notes: formData.notes.trim(),
    };

    try {
      if (editId) {
        await updateChatbot(editId, chatbotData);
        toast({
          title: "Success",
          description: "Care assistant updated successfully.",
        });
      } else {
        await addChatbot(chatbotData);
        toast({
          title: "Success",
          description: "Care assistant created successfully.",
        });
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save chatbot:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [
        ...formData.tasks,
        {
          name: "",
          time: "",
          description: "",
          priority: "normal",
          isSaved: true,
        },
      ],
    });

    setOpenAccordions([...openAccordions]);
  };

  const updateTask = (index: number, field: keyof Task, value: string) => {
    const updated = formData.tasks.map((task: Task, i: number) =>
      i === index ? { ...task, [field]: value } : task
    );
    setFormData({ ...formData, tasks: updated });
  };

  const removeTask = (index: number) => {
    const updatedTasks = formData.tasks.filter(
      (_: Task, i: number) => i !== index
    );
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const handleDelete = async () => {
    if (!editId) return;

    try {
      await deleteChatbot(editId);
      toast({
        title: "Success",
        description: "Care assistant deleted successfully.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete chatbot:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete. Please try again.",
      });
    }
    setShowDeleteDialog(false);
  };

  const isButtonDisabled =
    isSubmitting ||
    !formData.chatbotName.trim() ||
    formData.tasks.length === 0 ||
    formData.tasks.some((task: Task) => !task.name.trim() || !task.time.trim());

  return {
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
  };
}
