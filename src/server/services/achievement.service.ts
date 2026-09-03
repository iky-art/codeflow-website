import type { Env } from "../index";
import { userRepository } from "../repositories/user.repository";
import { gamificationRepository } from "../repositories/gamification.repository";

const DEFINITIONS: {
  code: string;
  title: string;
  description: string;
  check: (env: Env, userId: string) => Promise<boolean>;
}[] = [
  {
    code: "FIRST_STEP",
    title: "First Step",
    description: "First lesson completed",
    check: async (env, id) => (await userRepository.countCompletedLessons(env, id)) >= 1,
  },
  {
    code: "CODE_RUNNER",
    title: "Code Runner",
    description: "Complete 10 challenges",
    check: async (env, id) => (await userRepository.countSolvedChallenges(env, id)) >= 10,
  },
  {
    code: "WEEK_WARRIOR",
    title: "Week Warrior",
    description: "7 day streak",
    check: async (env, id) => {
      const user = await userRepository.findById(env, id);
      return (user?.streak ?? 0) >= 7;
    },
  },
  {
    code: "QUIZ_MASTER",
    title: "Quiz Master",
    description: "Score high on quizzes",
    check: async (env, id) => (await userRepository.quizAccuracy(env, id)) >= 85,
  },
];

export const achievementService = {
  definitions: () => DEFINITIONS,

  async checkAndGrant(env: Env, userId: string) {
    const granted: { code: string; title: string }[] = [];
    for (const def of DEFINITIONS) {
      if (await gamificationRepository.hasAchievement(env, userId, def.code)) continue;
      if (await def.check(env, userId)) {
        await gamificationRepository.grantAchievement(env, userId, def.code);
        granted.push({ code: def.code, title: def.title });
      }
    }
    return granted;
  },
};
