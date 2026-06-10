import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const quizLanguage = v.union(v.literal("tamil"), v.literal("english"));

export default defineSchema({
  questions: defineTable({
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
    isActive: v.boolean(),
    createdAt: v.number(),
  }),

  participants: defineTable({
    name: v.string(),
    phone: v.string(),
    phoneNormalized: v.optional(v.string()),
    language: v.optional(quizLanguage),
    startedAt: v.number(),
  }).index("by_phone", ["phoneNormalized"]),

  quizResults: defineTable({
    participantId: v.id("participants"),
    name: v.string(),
    phone: v.string(),
    phoneNormalized: v.optional(v.string()),
    language: v.optional(quizLanguage),
    score: v.number(),
    answeredQuestions: v.number(),
    completedAt: v.number(),
  })
    .index("by_participant", ["participantId"])
    .index("by_phone", ["phoneNormalized"]),
});
