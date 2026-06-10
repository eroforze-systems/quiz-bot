"use client";

import { useState } from "react";
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
import { ANSWER_OPTIONS, AnswerOption } from "@/lib/constants";

export type QuestionFormData = {
  questionTamil: string;
  questionEnglish: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionAEnglish: string;
  optionBEnglish: string;
  optionCEnglish: string;
  optionDEnglish: string;
  correctAnswer: AnswerOption;
};

type QuestionFormProps = {
  initialData?: QuestionFormData;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};

const emptyForm: QuestionFormData = {
  questionTamil: "",
  questionEnglish: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  optionAEnglish: "",
  optionBEnglish: "",
  optionCEnglish: "",
  optionDEnglish: "",
  correctAnswer: "A",
};

export function QuestionForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save Question",
}: QuestionFormProps) {
  const [form, setForm] = useState<QuestionFormData>(initialData ?? emptyForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-black/5 bg-neutral-50 p-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Tamil
        </p>
        <div className="space-y-2">
          <Label htmlFor="questionTamil">Question (Tamil)</Label>
          <Textarea
            id="questionTamil"
            value={form.questionTamil}
            onChange={(e) => setForm({ ...form, questionTamil: e.target.value })}
            required
            rows={3}
            placeholder="கேள்வியை தமிழில் உள்ளிடவும்"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="optionA">Option A (Tamil)</Label>
          <Input
            id="optionA"
            value={form.optionA}
            onChange={(e) => setForm({ ...form, optionA: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="optionB">Option B (Tamil)</Label>
          <Input
            id="optionB"
            value={form.optionB}
            onChange={(e) => setForm({ ...form, optionB: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="optionC">Option C (Tamil)</Label>
          <Input
            id="optionC"
            value={form.optionC}
            onChange={(e) => setForm({ ...form, optionC: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="optionD">Option D (Tamil)</Label>
          <Input
            id="optionD"
            value={form.optionD}
            onChange={(e) => setForm({ ...form, optionD: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-black/5 bg-neutral-50 p-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          English
        </p>
        <div className="space-y-2">
          <Label htmlFor="questionEnglish">Question (English)</Label>
          <Textarea
            id="questionEnglish"
            value={form.questionEnglish}
            onChange={(e) =>
              setForm({ ...form, questionEnglish: e.target.value })
            }
            required
            rows={3}
            placeholder="Enter question in English"
          />
        </div>
        {(
          [
            ["A", "optionAEnglish"],
            ["B", "optionBEnglish"],
            ["C", "optionCEnglish"],
            ["D", "optionDEnglish"],
          ] as const
        ).map(([label, field]) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>Option {label} (English)</Label>
            <Input
              id={field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Correct Answer</Label>
        <Select
          value={form.correctAnswer}
          onValueChange={(value) =>
            setForm({ ...form, correctAnswer: value as AnswerOption })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select correct answer" />
          </SelectTrigger>
          <SelectContent>
            {ANSWER_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                Option {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
