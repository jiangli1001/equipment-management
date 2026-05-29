'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabase/server';

export async function deleteChangeLog(id: string) {
  const supabase = await createServerSupabase();
  await supabase.from('change_logs').delete().eq('id', id);
  revalidatePath('/logs');
}

export async function batchDeleteChangeLogs(ids: string[]) {
  const supabase = await createServerSupabase();
  await supabase.from('change_logs').delete().in('id', ids);
  revalidatePath('/logs');
}

export async function updateChangeLogOperator(id: string, changedBy: string) {
  const supabase = await createServerSupabase();
  await supabase.from('change_logs').update({ changed_by: changedBy }).eq('id', id);
  revalidatePath('/logs');
}
