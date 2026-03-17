import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  /* Server-side guard — middleware also enforces this */
  if (!user) redirect('/login?next=/profile');

  /* Fetch profile info + game results in parallel */
  const [profileResult, recentResult, allStatsResult] = await Promise.all([

    /* Basic profile (name, avatar) */
    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, created_at')
      .eq('id', user.id)
      .single(),

    /* Last 5 results for the "Recent games" list */
    supabase
      .from('game_results')
      .select('id, score, correct_answers, total_questions, percentage, language, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),

    /* All results — only the fields needed for computing stats */
    supabase
      .from('game_results')
      .select('score, percentage')
      .eq('user_id', user.id),
  ]);

  /* ── Compute stats from real game_results rows ── */
  const allResults = allStatsResult.data ?? [];
  const computedStats = {
    totalGames: allResults.length,
    bestScore:  allResults.length ? Math.max(...allResults.map((r) => r.score)) : 0,
    avgPercent: allResults.length
      ? Math.round(
          allResults.reduce((s, r) => s + Number(r.percentage), 0) / allResults.length,
        )
      : 0,
    totalScore: allResults.reduce((s, r) => s + r.score, 0),
  };

  return (
    <ProfileClient
      user={user}
      profile={profileResult.data}
      recentResults={recentResult.data ?? []}
      stats={computedStats}
    />
  );
}
