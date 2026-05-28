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
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 2h5v5H2V2zm0 7h5v5H2V9zm7-7h5v5H9V2zm0 7h5v5H9V9z"/>
      </svg>
    ),
  },
  {
    href: '/logs',
    label: '变更记录',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 1.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm.5 2v3.086l2.207 2.207-.707.707L7.5 8V4.5h1z"/>
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
    <aside className="w-[220px] bg-sidebar-bg fixed top-0 left-0 h-screen z-50 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-6 border-b border-white/8">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white text-base font-bold mr-2 flex-shrink-0">
          仪
        </div>
        <span className="text-white text-[15px] font-semibold whitespace-nowrap">
          仪器设备管理
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-2">
        <div className="px-3 mb-1">
          <div className="text-[11px] text-white/35 uppercase tracking-wider px-2 py-1">
            功能菜单
          </div>
        </div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center mx-3 my-0.5 px-2 py-[9px] rounded-md text-sm text-sidebar-text no-underline transition-all duration-200 ${
              isActive(item.href)
                ? 'bg-primary text-white'
                : 'hover:text-white hover:bg-sidebar-hover'
            }`}
          >
            <span className="w-4 h-4 mr-2 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User info */}
      <div className="p-3 border-t border-white/8">
        <div className="flex items-center px-2 py-1 text-sidebar-text text-[13px]">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2 flex-shrink-0">
            管
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[13px]">管理员</div>
            <div className="text-[11px] text-sidebar-text truncate">
              {userPhone || '---'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-1 p-1 rounded text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-colors duration-200 border-0 bg-transparent cursor-pointer"
            title="退出登录"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 2v2H3v8h3v2H2V2h4zm4 3l3 3-3 3-.707-.707L11.586 8H6V7h5.586L9.293 4.293 10 5z"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
