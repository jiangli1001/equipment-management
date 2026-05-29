'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const menuItems = [
  {
    href: '/',
    label: '设备总览',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    href: '/logs',
    label: '变更记录',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserPhone((data.user.email || '').replace('@team.eq', ''));
      }
    });
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname.startsWith('/equipment');
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <aside className="w-[230px] bg-sidebar-bg fixed top-0 left-0 h-screen z-50 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-[60px] flex items-center px-5 border-b border-white/[0.06]">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white text-base font-bold mr-3 flex-shrink-0 shadow-lg shadow-primary/25">
          仪
        </div>
        <div>
          <div className="text-white text-[14px] font-semibold leading-tight">仪器设备管理</div>
          <div className="text-[11px] text-sidebar-text leading-tight">Equipment Manager</div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-3 px-3">
        <div className="text-[10px] text-sidebar-text/50 uppercase tracking-[1px] font-semibold px-3 mb-2">
          功能菜单
        </div>
        <div className="space-y-0.5">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-lg text-[14px] no-underline transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-sidebar-text hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="w-[18px] h-[18px] mr-3 flex items-center justify-center flex-shrink-0 opacity-80">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* User info */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center px-2 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-active text-white flex items-center justify-center text-xs font-bold mr-2.5 flex-shrink-0 shadow-sm">
            管
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[13px] font-medium leading-tight">管理员</div>
            <div className="text-[11px] text-sidebar-text leading-tight truncate">
              {userPhone || '---'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-1 p-1.5 rounded-md text-sidebar-text/40 hover:text-white hover:bg-white/[0.06] transition-all border-0 bg-transparent cursor-pointer opacity-0 group-hover:opacity-100"
            title="退出登录"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
