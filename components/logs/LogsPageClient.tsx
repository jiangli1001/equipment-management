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
  if (fieldName === '设备名称' || fieldName === '型号/编号') return 'tag-primary';
  if (fieldName === '所在地' || fieldName === '负责人') return 'tag-primary';
  return 'tag-default';
}

export default function LogsPageClient({ logs, nameMap }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('全部操作');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const ename = nameMap[log.equipment_id] || '';
      if (search && !ename.includes(search) && !log.changed_by.includes(search) && !log.new_value.includes(search)) {
        return false;
      }
      if (typeFilter !== '全部操作' && log.field_name !== typeFilter) return false;
      return true;
    });
  }, [logs, search, typeFilter, nameMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Header />
      <div className="p-6">
        <div className="bg-bg-container rounded-lg shadow-sm border border-border">
          {/* 工具栏 */}
          <div className="flex items-center justify-between px-6 py-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <input
                className="h-[34px] w-60 px-3 border border-border rounded-md text-sm outline-none transition-colors duration-200 hover:border-primary-hover focus:border-primary focus:shadow-[0_0_0_2px_var(--color-primary-bg)]"
                type="text"
                placeholder="搜索设备名称或操作人..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
              <button
                className="inline-flex items-center h-[34px] px-4 bg-white text-text-primary border border-[#D9D9D9] rounded-md text-sm cursor-pointer transition-all duration-200 hover:text-primary hover:border-primary"
                onClick={() => setSearch('')}
              >
                清除
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="h-[34px] w-[140px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none appearance-none bg-no-repeat bg-[position:right_12px_center] pr-8 transition-colors duration-200 hover:border-primary-hover focus:border-primary"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='rgba(0,0,0,0.25)'/%3E%3C/svg%3E")` }}
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              >
                {typeOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto">
            {paged.length === 0 ? (
              <div className="py-16 text-center text-text-tertiary">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-20" viewBox="0 0 64 64" fill="currentColor"><rect x="2" y="2" width="60" height="60" rx="4"/><circle cx="20" cy="22" r="3"/><path d="M20 30h24M20 38h18M20 46h22" stroke="#fff" strokeWidth="2" fill="none"/></svg>
                没有找到匹配的变更记录
              </div>
            ) : (
              <table className="table-default">
                <thead>
                  <tr>
                    <th className="w-[160px]">操作时间</th>
                    <th>设备名称</th>
                    <th>操作类型</th>
                    <th>变更内容</th>
                    <th className="w-[140px]">操作人</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((log) => (
                    <tr key={log.id}>
                      <td className="text-text-secondary">
                        {new Date(log.changed_at).toLocaleString('zh-CN', {
                          year: 'numeric', month: '2-digit', day: '2-digit',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td>
                        <Link
                          href={`/equipment/${log.equipment_id}`}
                          className="text-text-primary no-underline font-medium hover:text-primary"
                        >
                          {nameMap[log.equipment_id] || log.equipment_id.slice(0, 8)}
                        </Link>
                      </td>
                      <td>
                        <span className={`tag ${typeTagClass(log.field_name)}`}>
                          {log.field_name}变更
                        </span>
                      </td>
                      <td>
                        {log.old_value ? (
                          <>
                            <span className="text-text-tertiary line-through mr-1.5">{log.old_value}</span>
                            <span className="text-text-tertiary mx-1">→</span>
                            <span className="text-text-primary font-medium">{log.new_value}</span>
                          </>
                        ) : (
                          <span className="text-text-secondary">初始登记：{log.new_value}</span>
                        )}
                      </td>
                      <td className="text-text-secondary">{log.changed_by || '---'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-end px-6 py-4 gap-2">
            <span className="text-[13px] text-text-secondary mr-2">共 {filtered.length} 条</span>
            <button
              className={`min-w-[32px] h-8 inline-flex items-center justify-center border border-border rounded-md bg-white text-sm transition-colors duration-200 ${page <= 1 ? 'text-text-disabled cursor-not-allowed' : 'cursor-pointer hover:text-primary hover:border-primary'}`}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >←</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`min-w-[32px] h-8 inline-flex items-center justify-center border rounded-md text-sm transition-colors duration-200 cursor-pointer ${page === p ? 'bg-primary text-white border-primary' : 'bg-white border-border hover:text-primary hover:border-primary'}`}
                onClick={() => setPage(p)}
              >{p}</button>
            ))}
            <button
              className={`min-w-[32px] h-8 inline-flex items-center justify-center border border-border rounded-md bg-white text-sm transition-colors duration-200 ${page >= totalPages ? 'text-text-disabled cursor-not-allowed' : 'cursor-pointer hover:text-primary hover:border-primary'}`}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >→</button>
          </div>
        </div>
      </div>
    </>
  );
}
