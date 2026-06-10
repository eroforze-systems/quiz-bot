import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { quizLanguage } from "./schema";
import { normalizePhone } from "./phone";

export const submit = mutation({
  args: {
    participantId: v.id("participants"),
    name: v.string(),
    phone: v.string(),
    language: quizLanguage,
    score: v.number(),
    answeredQuestions: v.number(),
  },
  handler: async (ctx, args) => {
    const phoneNormalized = normalizePhone(args.phone);

    return await ctx.db.insert("quizResults", {
      participantId: args.participantId,
      name: args.name,
      phone: args.phone,
      phoneNormalized,
      language: args.language,
      score: args.score,
      answeredQuestions: args.answeredQuestions,
      completedAt: Date.now(),
    });
  },
});

export const getLatestByParticipant = query({
  args: { participantId: v.id("participants") },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_participant", (q) =>
        q.eq("participantId", args.participantId)
      )
      .collect();

    if (results.length === 0) return null;
    return results.sort((a, b) => b.completedAt - a.completedAt)[0];
  },
});

/** @deprecated Use getLatestByParticipant */
export const getByParticipant = query({
  args: { participantId: v.id("participants") },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_participant", (q) =>
        q.eq("participantId", args.participantId)
      )
      .collect();

    if (results.length === 0) return null;
    return results.sort((a, b) => b.completedAt - a.completedAt)[0];
  },
});

export const listByParticipant = query({
  args: { participantId: v.id("participants") },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_participant", (q) =>
        q.eq("participantId", args.participantId)
      )
      .collect();

    return results.sort((a, b) => b.completedAt - a.completedAt);
  },
});

export const listByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    const phoneNormalized = normalizePhone(args.phone);

    const indexed = await ctx.db
      .query("quizResults")
      .withIndex("by_phone", (q) => q.eq("phoneNormalized", phoneNormalized))
      .collect();

    if (indexed.length > 0) {
      return indexed.sort((a, b) => b.completedAt - a.completedAt);
    }

    const all = await ctx.db.query("quizResults").collect();
    return all
      .filter((r) => normalizePhone(r.phone) === phoneNormalized)
      .sort((a, b) => b.completedAt - a.completedAt);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quizResults").order("desc").collect();
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("quizResults").collect();
    return results.length;
  },
});

export const highestScore = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("quizResults").collect();
    if (results.length === 0) return 0;
    return Math.max(...results.map((r) => r.score));
  },
});
