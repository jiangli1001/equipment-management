'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(phone: string, password: string) {
  const email = `${phone}@team.eq`;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
      },
      body: JSON.stringify({ email, password, gotrue_meta_security: {} }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = (data as { error_description?: string; error?: string }).error_description
        || (data as { error?: string }).error
        || `HTTP ${res.status}`;
      return { error: msg };
    }

    // 设置 session cookie
    const cookieStore = await cookies();
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0];

    cookieStore.set(
      `${projectRef}-auth-token`,
      JSON.stringify([data.access_token, data.refresh_token, 'token']),
      {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: data.expires_in || 3600,
        path: '/',
      }
    );

  } catch (e) {
    return { error: `网络错误: ${(e as Error).message}` };
  }

  redirect('/');
}
