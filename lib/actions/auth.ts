'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(phone: string, password: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, anonKey);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${phone}@team.eq`,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    const cookieStore = await cookies();
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0];

    cookieStore.set(
      `sb-${projectRef}-auth-token`,
      JSON.stringify([
        data.session.access_token,
        data.session.refresh_token,
        'token',
      ]),
      {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: data.session.expires_in || 3600,
        path: '/',
      }
    );
  }

  redirect('/');
}
