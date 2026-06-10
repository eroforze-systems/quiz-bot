import { query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("quizResults").collect();
    const participants = results.sort((a, b) => b.completedAt - a.completedAt);

    const highestScore =
      results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0;

    return {
      totalParticipants: results.length,
      highestScore,
      participants,
    };
  },
});
