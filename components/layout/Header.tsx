'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header({ extra }: { extra?: React.ReactNode }) {
  const pathname = usePathname();

  const isDetail = pathname.match(/^\/equipment\/(.+)\/edit$/);
  const isViewDetail = pathname.match(/^\/equipment\/(.+)$/);
  const isNew = pathname === '/equipment/new';

  let breadcrumbs: { path: string; label: string }[] = [];

  if (isDetail) {
    breadcrumbs = [
      { path: '/', label: '设备管理' },
      { path: `/equipment/${isDetail[1]}`, label: '设备详情' },
      { path: '', label: '编辑设备' },
    ];
  } else if (isViewDetail) {
    breadcrumbs = [
      { path: '/', label: '设备管理' },
      { path: '', label: '设备详情' },
    ];
  } else if (isNew) {
    breadcrumbs = [
      { path: '/', label: '设备管理' },
      { path: '', label: '新增设备' },
    ];
  } else if (pathname === '/logs') {
    breadcrumbs = [
      { path: '/', label: '设备管理' },
      { path: '', label: '变更记录' },
    ];
  } else {
    breadcrumbs = [
      { path: '/', label: '设备管理' },
      { path: '', label: '设备总览' },
    ];
  }

  return (
    <div className="h-[56px] bg-bg-container/80 backdrop-blur-sm flex items-center justify-between px-6 border-b border-border sticky top-0 z-40">
      <div className="flex items-center gap-2 text-[13px] text-text-tertiary">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-border">/</span>}
            {crumb.path ? (
              <Link href={crumb.path} className="text-text-tertiary no-underline hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-text-primary font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>
      {extra && <div className="flex items-center gap-2">{extra}</div>}
    </div>
  );
}
