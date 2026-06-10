"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { DashboardNav } from "@/components/dashboard-nav";
import { QuestionForm, QuestionFormData } from "@/components/question-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function QuestionsPage() {
  const questions = useQuery(api.questions.list);
  const createQuestion = useMutation(api.questions.create);
  const updateQuestion = useMutation(api.questions.update);
  const deleteQuestion = useMutation(api.questions.remove);
  const toggleActive = useMutation(api.questions.toggleActive);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"questions"> | null>(null);

  const editingQuestion = questions?.find((q) => q._id === editingId);

  const handleCreate = async (data: QuestionFormData) => {
    await createQuestion(data);
    setDialogOpen(false);
  };

  const handleUpdate = async (data: QuestionFormData) => {
    if (!editingId) return;
    await updateQuestion({ id: editingId, ...data });
    setEditingId(null);
    setDialogOpen(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (id: Id<"questions">) => {
    setEditingId(id);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-full flex-1 bg-muted/30">
      <DashboardNav />
      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Question Management</h1>
            <p className="text-muted-foreground">
              Add, edit, and manage Tamil quiz questions
            </p>
          </div>
          <Button onClick={openCreate}>Add Question</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Questions</CardTitle>
            <CardDescription>
              {questions ? `${questions.length} questions in bank` : "Loading..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!questions ? (
              <p className="text-muted-foreground">Loading questions...</p>
            ) : questions.length === 0 ? (
              <p className="text-muted-foreground">
                No questions yet. Add your first question to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question (EN)</TableHead>
                    <TableHead>Question (TA)</TableHead>
                    <TableHead>Correct</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((q) => (
                    <TableRow key={q._id}>
                      <TableCell className="max-w-xs truncate font-medium">
                        {q.questionEnglish}
                      </TableCell>
                      <TableCell className="max-w-xs truncate font-medium">
                        {q.questionTamil}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{q.correctAnswer}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={q.isActive}
                            onCheckedChange={() => toggleActive({ id: q._id })}
                          />
                          <span className="text-sm text-muted-foreground">
                            {q.isActive ? "Active" : "Disabled"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(q._id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this question?"
                                )
                              ) {
                                deleteQuestion({ id: q._id });
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Question" : "Add Question"}
            </DialogTitle>
          </DialogHeader>
          <QuestionForm
            key={editingId ?? "new"}
            initialData={
              editingQuestion
                ? {
                    questionTamil: editingQuestion.questionTamil,
                    questionEnglish: editingQuestion.questionEnglish,
                    optionA: editingQuestion.optionA,
                    optionB: editingQuestion.optionB,
                    optionC: editingQuestion.optionC,
                    optionD: editingQuestion.optionD,
                    optionAEnglish: editingQuestion.optionAEnglish,
                    optionBEnglish: editingQuestion.optionBEnglish,
                    optionCEnglish: editingQuestion.optionCEnglish,
                    optionDEnglish: editingQuestion.optionDEnglish,
                    correctAnswer: editingQuestion.correctAnswer,
                  }
                : undefined
            }
            onSubmit={editingId ? handleUpdate : handleCreate}
            onCancel={() => setDialogOpen(false)}
            submitLabel={editingId ? "Update Question" : "Add Question"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
