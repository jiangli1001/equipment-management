'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/actions/auth';

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

    const result = await login(phone, password);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-[400px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-primary/25">
            仪
          </div>
          <h2 className="text-[22px] font-bold text-text-primary m-0">仪器设备管理系统</h2>
          <p className="text-text-tertiary text-sm mt-1.5">专业仪器台账管理平台</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-[13px] font-medium text-text-secondary">手机号</label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              <input
                className="w-full h-[44px] pl-10 pr-4 border border-border rounded-xl text-sm outline-none bg-bg-layout transition-all duration-200 hover:border-primary-outline focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-bg)]"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1.5 text-[13px] font-medium text-text-secondary">密码</label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input
                className="w-full h-[44px] pl-10 pr-4 border border-border rounded-xl text-sm outline-none bg-bg-layout transition-all duration-200 hover:border-primary-outline focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-bg)]"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-error-bg border border-error-border rounded-xl text-sm text-error flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[44px] bg-primary text-white rounded-xl text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" opacity="0.3"/></svg>
                登录中...
              </span>
            ) : '登 录'}
          </button>
        </form>
      </div>
    </div>
  );
}
