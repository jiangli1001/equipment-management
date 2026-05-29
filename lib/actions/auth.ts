'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(phone: string, password: string) {
  const email = `${phone}@team.eq`;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
    },
    body: JSON.stringify({ email, password, gotrue_meta_security: {} }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: (data as { error_description?: string }).error_description || '登录失败，请检查手机号或密码' };
  }

  const data = await res.json();

  // 设置 session cookies
  const cookieStore = await cookies();

  if (data.access_token) {
    const tokenParts = data.access_token.split('.');
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());

    cookieStore.set(
      `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`,
      JSON.stringify([data.access_token, data.refresh_token, 'token']),
      {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: data.expires_in || 3600,
        path: '/',
      }
    );

    cookieStore.set(
      `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token-code-verifier`,
      '',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      }
    );
  }

  redirect('/');
}
