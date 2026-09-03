import type { Env } from "../index";
import { userRepository } from "../repositories/user.repository";
import { gamificationRepository } from "../repositories/gamification.repository";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function daysBetween(a: string, b: string) {
  return Math.round((new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime()) / 86400000);
}

export const streakService = {
  async touch(env: Env, userId: string): Promise<number> {
    const user = await userRepository.findById(env, userId);
    if (!user) throw new Error("User not found");

    const today = todayStr();
    if (user.last_active_date === today) return user.streak;

    let newStreak = 1;
    if (user.last_active_date) {
      const diff = daysBetween(user.last_active_date, today);
      if (diff === 1) newStreak = user.streak + 1;
    }

    await userRepository.updateStreak(env, userId, newStreak, today);
    await gamificationRepository.recordStreakDay(env, userId, today);
    return newStreak;
  },
};
