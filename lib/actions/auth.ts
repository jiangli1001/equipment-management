'use server';

import { createServerSupabase } from '@/lib/supabase/server';

export async function login(phone: string, password: string) {
  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithPassword({
    email: `${phone}@team.eq`,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
