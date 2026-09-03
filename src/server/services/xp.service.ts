import type { Env } from "../index";
import { userRepository } from "../repositories/user.repository";
import { gamificationRepository } from "../repositories/gamification.repository";

// XP required cumulatively to reach a given level — soft curve, gets steeper.
function xpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) total += 100 + i * 25;
  return total;
}
function levelFromXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
}

export const xpService = {
  async award(env: Env, userId: string, amount: number, reason: string) {
    const user = await userRepository.findById(env, userId);
    if (!user) throw new Error("User not found");

    const newXp = user.xp + amount;
    const newLevel = levelFromXp(newXp);
    const leveledUp = newLevel > user.level;

    await userRepository.updateXpAndLevel(env, userId, newXp, newLevel);
    await gamificationRepository.addXpTransaction(env, userId, amount, reason);

    return { newXp, newLevel, leveledUp, xpAwarded: amount };
  },
};
