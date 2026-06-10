import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { quizLanguage } from "./schema";

const questionFields = {
  questionTamil: v.string(),
  questionEnglish: v.string(),
  optionA: v.string(),
  optionB: v.string(),
  optionC: v.string(),
  optionD: v.string(),
  optionAEnglish: v.string(),
  optionBEnglish: v.string(),
  optionCEnglish: v.string(),
  optionDEnglish: v.string(),
  correctAnswer: v.union(
    v.literal("A"),
    v.literal("B"),
    v.literal("C"),
    v.literal("D")
  ),
};

function localizeQuestion(
  question: {
    _id: string;
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
  },
  language: "tamil" | "english"
) {
  if (language === "english") {
    return {
      _id: question._id,
      questionText: question.questionEnglish,
      optionA: question.optionAEnglish,
      optionB: question.optionBEnglish,
      optionC: question.optionCEnglish,
      optionD: question.optionDEnglish,
    };
  }

  return {
    _id: question._id,
    questionText: question.questionTamil,
    optionA: question.optionA,
    optionB: question.optionB,
    optionC: question.optionC,
    optionD: question.optionD,
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("questions").order("desc").collect();
  },
});

export const create = mutation({
  args: questionFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("questions", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("questions"),
    ...questionFields,
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.id);
    if (!question) throw new Error("Question not found");
    await ctx.db.patch(args.id, { isActive: !question.isActive });
  },
});

export const getRandomQuestions = query({
  args: {
    count: v.number(),
    language: quizLanguage,
  },
  handler: async (ctx, args) => {
    const active = await ctx.db.query("questions").collect();
    const filtered = active.filter((q) => q.isActive);

    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, args.count);

    return selected.map((question) =>
      localizeQuestion(question, args.language)
    );
  },
});

export const checkAnswer = mutation({
  args: {
    questionId: v.id("questions"),
    selectedAnswer: v.union(
      v.literal("A"),
      v.literal("B"),
      v.literal("C"),
      v.literal("D")
    ),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    if (!question) throw new Error("Question not found");
    return {
      isCorrect: question.correctAnswer === args.selectedAnswer,
      correctAnswer: question.correctAnswer,
    };
  },
});
