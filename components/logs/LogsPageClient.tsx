'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { deleteChangeLog, batchDeleteChangeLogs, updateChangeLogOperator } from '@/lib/actions/changeLogs';
import type { ChangeLog } from '@/lib/types';

interface Props {
  logs: ChangeLog[];
  nameMap: Record<string, string>;
}

const typeOptions = ['全部操作', '所在地', '负责人', '状态', '设备名称', '型号/编号'];
const operatorNames = ['范磊然', '江立', '许明祥', '王小哲'];

function typeTagClass(fieldName: string) {
  if (fieldName === '状态') return 'tag-warning';
  return 'tag-primary';
}

export default function LogsPageClient({ logs, nameMap }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('全部操作');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const allSelected = paged.length > 0 && paged.every((l) => selectedIds.has(l.id));
  const someSelected = selectedIds.size > 0;

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paged.forEach((l) => next.delete(l.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paged.forEach((l) => next.add(l.id));
        return next;
      });
    }
  }, [allSelected, paged]);

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    await batchDeleteChangeLogs(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleDelete = async (id: string) => {
    await deleteChangeLog(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleOperatorChange = async (id: string, name: string) => {
    await updateChangeLogOperator(id, name);
    setEditingId(null);
  };

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
            <div className="flex items-center gap-2">
              {someSelected && (
                <button
                  className="inline-flex items-center gap-1.5 h-[36px] px-4 bg-error text-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-red-600 border-0"
                  onClick={handleBatchDelete}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  删除选中 ({selectedIds.size})
                </button>
              )}
              <select
                className="w-[130px] h-[36px] px-3 pr-8 border border-border rounded-lg text-sm outline-none bg-bg-layout appearance-none bg-no-repeat bg-[position:right_10px_center] transition-all duration-200 hover:border-primary-outline focus:border-primary focus:bg-white"
                style={selectArrow}
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
                    <th className="w-[40px]">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="w-[155px]">操作时间</th>
                    <th>设备名称</th>
                    <th>操作类型</th>
                    <th>变更内容</th>
                    <th className="w-[130px]">操作人</th>
                    <th className="w-[70px]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((log) => (
                    <tr key={log.id} className={selectedIds.has(log.id) ? 'bg-primary-bg/30' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                          checked={selectedIds.has(log.id)}
                          onChange={() => toggleSelect(log.id)}
                        />
                      </td>
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
                      <td>
                        {editingId === log.id ? (
                          <select
                            className="h-[32px] w-[100px] px-2 pr-7 border border-primary rounded-md text-xs outline-none appearance-none bg-no-repeat bg-[position:right_6px_center] bg-white"
                            style={selectArrow}
                            defaultValue={log.changed_by}
                            onChange={(e) => handleOperatorChange(log.id, e.target.value)}
                            onBlur={() => setEditingId(null)}
                            autoFocus
                          >
                            {operatorNames.map((n) => <option key={n}>{n}</option>)}
                          </select>
                        ) : (
                          <button
                            className="text-[13px] text-text-secondary hover:text-primary cursor-pointer border-0 bg-transparent px-0 py-0 transition-colors"
                            onClick={() => setEditingId(log.id)}
                            title="点击更改操作人"
                          >
                            {log.changed_by || '---'}
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-text-tertiary hover:text-error hover:bg-error-bg transition-all cursor-pointer border-0 bg-transparent"
                          onClick={() => handleDelete(log.id)}
                          title="删除此记录"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </button>
                      </td>
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
              {someSelected && <span className="ml-2 text-primary">（已选 {selectedIds.size} 条）</span>}
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
