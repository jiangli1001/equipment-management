'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import type { ChangeLog } from '@/lib/types';

interface Props {
  logs: ChangeLog[];
  nameMap: Record<string, string>;
}

const typeOptions = ['全部操作', '所在地', '负责人', '状态', '设备名称', '型号/编号'];

function typeTagClass(fieldName: string) {
  if (fieldName === '状态') return 'tag-warning';
  return 'tag-primary';
}

export default function LogsPageClient({ logs, nameMap }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('全部操作');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const ename = nameMap[log.equipment_id] || '';
      if (search && !ename.includes(search) && !log.changed_by.includes(search) && !log.new_value.includes(search)) return false;
      if (typeFilter !== '全部操作' && log.field_name !== typeFilter) return false;
      return true;
    });
  }, [logs, search, typeFilter, nameMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const selectArrow = { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%2394A3B8'/%3E%3C/svg%3E")` };

  return (
    <>
      <Header />
      <div className="p-6 animate-fadeIn">
        <div className="bg-bg-container rounded-xl border border-border overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)' }}>
          {/* 工具栏 */}
          <div className="flex items-center justify-between px-6 py-4 flex-wrap gap-3 border-b border-divider">
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input
                  className="h-[36px] w-[240px] pl-9 pr-3 border border-border rounded-lg text-sm outline-none bg-bg-layout transition-all duration-200 hover:border-primary-outline focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-bg)]"
                  type="text"
                  placeholder="搜索设备名称或操作人..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              {search && (
                <button className="text-sm text-text-tertiary hover:text-text-primary transition-colors px-2 py-1" onClick={() => setSearch('')}>清除</button>
              )}
            </div>
            <select
              className="w-[130px] h-[36px] px-3 pr-8 border border-border rounded-lg text-sm outline-none bg-bg-layout appearance-none bg-no-repeat bg-[position:right_10px_center] transition-all duration-200 hover:border-primary-outline focus:border-primary focus:bg-white"
              style={selectArrow}
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            >
              {typeOptions.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto">
            {paged.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bg-layout flex items-center justify-center">
                  <svg className="w-8 h-8 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2 2"/></svg>
                </div>
                <div className="text-text-secondary text-sm">没有找到匹配的变更记录</div>
              </div>
            ) : (
              <table className="table-default">
                <thead>
                  <tr>
                    <th className="w-[155px]">操作时间</th>
                    <th>设备名称</th>
                    <th>操作类型</th>
                    <th>变更内容</th>
                    <th className="w-[140px]">操作人</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((log) => (
                    <tr key={log.id}>
                      <td className="text-text-tertiary text-[13px]">
                        {new Date(log.changed_at).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <Link href={`/equipment/${log.equipment_id}`} className="text-text-primary no-underline font-medium hover:text-primary transition-colors">
                          {nameMap[log.equipment_id] || log.equipment_id.slice(0, 8)}
                        </Link>
                      </td>
                      <td><span className={`tag ${typeTagClass(log.field_name)}`}>{log.field_name}变更</span></td>
                      <td>
                        {log.old_value ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="text-text-tertiary line-through text-[13px]">{log.old_value}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            <span className="text-text-primary font-medium">{log.new_value}</span>
                          </span>
                        ) : (
                          <span className="text-text-secondary text-[13px]">初始登记：{log.new_value}</span>
                        )}
                      </td>
                      <td className="text-text-secondary text-[13px]">{log.changed_by || '---'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-divider">
            <span className="text-[13px] text-text-tertiary">
              显示 {filtered.length > 0 ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, filtered.length)}，共 {filtered.length} 条
            </span>
            <div className="flex items-center gap-1">
              <button className={`min-w-[34px] h-8 inline-flex items-center justify-center border border-border rounded-lg bg-white text-sm transition-all duration-200 ${page <= 1 ? 'text-text-disabled cursor-not-allowed opacity-50' : 'hover:text-primary hover:border-primary cursor-pointer'}`} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`min-w-[34px] h-8 inline-flex items-center justify-center border rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer ${page === p ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' : 'bg-white border-border hover:text-primary hover:border-primary'}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className={`min-w-[34px] h-8 inline-flex items-center justify-center border border-border rounded-lg bg-white text-sm transition-all duration-200 ${page >= totalPages ? 'text-text-disabled cursor-not-allowed opacity-50' : 'hover:text-primary hover:border-primary cursor-pointer'}`} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>→</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
