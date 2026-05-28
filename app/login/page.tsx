'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [phone, setPhone] = useState('13774198578');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: `${phone}@team.eq`,
      password,
    });

    if (signInError) {
      setError('登录失败，请检查手机号或密码');
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667EEA] to-[#764BA2]">
      <div className="w-[380px] bg-white rounded-lg shadow-[0_1px_2px_-2px_rgba(0,0,0,0.16),0_3px_6px_0_rgba(0,0,0,0.12),0_5px_12px_4px_rgba(0,0,0,0.09)] p-10">
        <h2 className="text-center text-2xl font-bold mb-2">仪器设备管理系统</h2>
        <p className="text-center text-text-secondary mb-8">专业仪器台账管理平台</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm text-text-primary">手机号</label>
            <input
              className="w-full h-[42px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none transition-colors duration-200 hover:border-primary-hover focus:border-primary focus:shadow-[0_0_0_2px_var(--color-primary-bg)]"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm text-text-primary">密码</label>
            <input
              className="w-full h-[42px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none transition-colors duration-200 hover:border-primary-hover focus:border-primary focus:shadow-[0_0_0_2px_var(--color-primary-bg)]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-error-bg border border-error-border rounded-md text-sm text-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-primary text-white rounded-md text-[15px] cursor-pointer transition-all duration-200 hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>
      </div>
    </div>
  );
}
