import { v } from "convex/values";
import { mutation } from "./_generated/server";

const questionInput = v.object({
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
});

export const bulkImport = mutation({
  args: {
    questions: v.array(questionInput),
    replaceExisting: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.replaceExisting) {
      const existing = await ctx.db.query("questions").collect();
      for (const question of existing) {
        await ctx.db.delete(question._id);
      }
    }

    const now = Date.now();
    let imported = 0;

    for (const question of args.questions) {
      await ctx.db.insert("questions", {
        ...question,
        isActive: true,
        createdAt: now + imported,
      });
      imported += 1;
    }

    return { imported };
  },
});
