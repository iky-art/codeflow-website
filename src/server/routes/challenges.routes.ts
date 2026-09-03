import type { Env } from "../index";
import { json } from "../utils/response";
import { resolveUser } from "../middleware/auth.middleware";
import { contentRepository } from "../repositories/content.repository";
import { challengeRepository } from "../repositories/challenge.repository";
import { xpService } from "../services/xp.service";
import { streakService } from "../services/streak.service";
import { achievementService } from "../services/achievement.service";

export async function handleChallengeSubmitRoute(request: Request, env: Env, path: string): Promise<Response | null> {
  const submitMatch = path.match(/^\/api\/challenges\/([^/]+)\/submit$/);
  if (!submitMatch || request.method !== "POST") return null;

  const user = await resolveUser(request, env);
  if (!user) return json({ message: "Unauthorized" }, 401);

  const challengeId = submitMatch[1];
  const challenge: any = await contentRepository.getChallengeById(env, challengeId);
  if (!challenge) return json({ message: "Challenge tidak ditemukan" }, 404);

  const body = await request.json<any>().catch(() => ({}));
  const markSolved = body.solved === true; // client marks solved after self-checking; real code execution is out of scope for now

  await challengeRepository.recordSubmission(env, user.id, challengeId, markSolved ? "solved" : "attempted");

  if (!markSolved) return json({ recorded: true, status: "attempted" });

  const alreadySolved = await challengeRepository.hasSolved(env, user.id, challengeId);
  let xpResult = null;
  if (!alreadySolved) {
    xpResult = await xpService.award(env, user.id, challenge.xp_reward, `challenge:${challengeId}`);
  }
  const newStreak = await streakService.touch(env, user.id);
  const achievements = await achievementService.checkAndGrant(env, user.id);

  return json({ recorded: true, status: "solved", alreadySolved, xpResult, newStreak, achievements });
}
