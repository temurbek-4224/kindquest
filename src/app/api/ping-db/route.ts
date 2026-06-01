/**
 * TEMPORARY DIAGNOSTIC ROUTE — remove after investigation.
 *
 * Queries Supabase from Vercel's server network using the service role key
 * so we can confirm: question count, column names, first 3 rows, and
 * whether anon RLS allows reads.
 *
 * Never exposes the service role key to the client — it stays server-side.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs'; // use Node runtime (not Edge) — no timeout issue

export async function GET() {
  const url    = process.env.NEXT_PUBLIC_SUPABASE_URL    ?? '';
  const anon   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY   ?? '';

  const result: Record<string, unknown> = {
    supabase_url_prefix: url ? url.slice(0, 40) + '…' : '(missing)',
    anon_key_length:     anon.length,
    svc_key_present:     svcKey.length > 30,
  };

  // ── Test 1: anon client — simulates what the game page does ──────────
  if (url && anon) {
    const anonClient = createClient(url, anon, { auth: { persistSession: false } });
    const { data: anonData, error: anonErr } = await anonClient
      .from('questions')
      .select('id, question_uz')
      .limit(3);

    result.anon_read = {
      error:   anonErr ? { message: anonErr.message, code: anonErr.code } : null,
      rowCount: anonData?.length ?? 0,
      rows:     anonData ?? [],
    };
  } else {
    result.anon_read = 'skipped — missing url or anon key';
  }

  // ── Test 2: service-role client — bypasses RLS ────────────────────────
  if (url && svcKey) {
    const svcClient = createClient(url, svcKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Total count
    const { count, error: countErr } = await svcClient
      .from('questions')
      .select('*', { count: 'exact', head: true });

    // First 3 rows
    const { data: rows, error: rowsErr } = await svcClient
      .from('questions')
      .select('id, category, question_uz')
      .limit(3);

    // Column names via information_schema
    const { data: cols, error: colsErr } = await svcClient
      .from('information_schema.columns' as string)
      .select('column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'questions')
      .order('ordinal_position');

    result.service_role_read = {
      count_error: countErr ? countErr.message : null,
      total_count: count,
      rows_error:  rowsErr  ? rowsErr.message  : null,
      first_3_rows: rows ?? [],
      cols_error:  colsErr  ? colsErr.message  : null,
      columns:     cols ?? [],
    };
  } else {
    result.service_role_read = 'skipped — missing service role key';
  }

  return NextResponse.json(result, {
    headers: {
      // Never cache — this is a one-shot diagnostic
      'Cache-Control': 'no-store',
      // Restrict: only this Vercel deployment can be the origin of calls
      // (does not block server-to-server, which is fine for diagnostics)
    },
  });
}
