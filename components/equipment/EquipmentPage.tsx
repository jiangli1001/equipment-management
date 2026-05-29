'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import type { Equipment } from '@/lib/types';

interface Props {
  equipment: Equipment[];
  stats: { total: number; normal: number; repairing: number; scrapped: number };
}

const statConfig = [
  { key: 'total', label: '设备总数', color: 'blue', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { key: 'normal', label: '正常在用', color: 'green', icon: 'M5 13l4 4L19 7' },
  { key: 'repairing', label: '维修中', color: 'orange', icon: 'M12 9v4m0 2v.01M12 3a9 9 0 100 18 9 9 0 000-18z' },
  { key: 'scrapped', label: '已报废', color: 'red', icon: 'M6 6l12 12M18 6L6 18' },
];

const statusTag = (status: string) => {
  if (status === '维修中') return 'tag-warning';
  if (status === '已报废') return 'tag-error';
  return 'tag-success';
};

export default function EquipmentPage({ equipment, stats }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部状态');
  const [personFilter, setPersonFilter] = useState('全部负责人');
  const [locationFilter, setLocationFilter] = useState('全部地点');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const persons = useMemo(() => [...new Set(equipment.map((e) => e.responsible_person))], [equipment]);
  const locations = useMemo(() => [...new Set(equipment.map((e) => e.location))], [equipment]);

  const filtered = useMemo(() => {
    return equipment.filter((e) => {
      if (search && !e.name.includes(search) && !e.model.includes(search) && !e.location.includes(search)) return false;
      if (statusFilter !== '全部状态' && e.status !== statusFilter) return false;
      if (personFilter !== '全部负责人' && e.responsible_person !== personFilter) return false;
      if (locationFilter !== '全部地点' && e.location !== locationFilter) return false;
      return true;
    });
  }, [equipment, search, statusFilter, personFilter, locationFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const selectArrow = { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%2394A3B8'/%3E%3C/svg%3E")` };

  return (
    <>
      <Header
        extra={
          <Link
            href="/equipment/new"
            className="inline-flex items-center gap-1.5 px-5 h-[38px] bg-primary text-white rounded-lg text-sm font-medium no-underline transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            新增设备
          </Link>
        }
      />

      <div className="p-6 animate-fadeIn">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {statConfig.map(({ key, label, color, icon }) => {
            const gradients: Record<string, string> = {
              blue: 'from-indigo-50 to-blue-50 border-indigo-100',
              green: 'from-emerald-50 to-teal-50 border-emerald-100',
              orange: 'from-amber-50 to-orange-50 border-amber-100',
              red: 'from-rose-50 to-red-50 border-rose-100',
            };
            const iconBg: Record<string, string> = {
              blue: 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-indigo-500/25',
              green: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/25',
              orange: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/25',
              red: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/25',
            };
            const dotColor: Record<string, string> = {
              blue: 'bg-indigo-500',
              green: 'bg-emerald-500',
              orange: 'bg-amber-500',
              red: 'bg-rose-500',
            };
            return (
              <div
                key={key}
                className={`stat-card stat-card-${color} relative overflow-hidden bg-gradient-to-br ${gradients[color]} rounded-xl border hover:shadow-lg transition-all duration-300 cursor-default`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">{label}</span>
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor[color]}`} />
                  </div>
                  <div className="text-[36px] font-extrabold text-text-primary leading-none tracking-tighter tabular-nums">
                    {stats[key as keyof typeof stats]}
                  </div>
                </div>
                <div className={`absolute -bottom-3 -right-3 w-20 h-20 ${iconBg[color]} rounded-2xl flex items-center justify-center opacity-20 rotate-12`}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon}/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* 表格卡片 */}
        <div className="bg-bg-container rounded-xl border border-border overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)' }}>
          {/* 工具栏 */}
          <div className="flex items-center justify-between px-6 py-4 flex-wrap gap-3 border-b border-divider">
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input
                  className="h-[36px] w-[240px] pl-9 pr-3 border border-border rounded-lg text-sm outline-none bg-bg-layout transition-all duration-200 hover:border-primary-outline focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-bg)]"
                  type="text"
                  placeholder="搜索设备名称、型号、地点..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              {search && (
                <button
                  className="text-sm text-text-tertiary hover:text-text-primary transition-colors px-2 py-1"
                  onClick={() => setSearch('')}
                >
                  清除
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {[
                { value: statusFilter, set: setStatusFilter, options: ['全部状态','正常','维修中','已报废'], width: 'w-[110px]' },
                { value: personFilter, set: setPersonFilter, options: ['全部负责人', ...persons], width: 'w-[130px]' },
                { value: locationFilter, set: setLocationFilter, options: ['全部地点', ...locations], width: 'w-[170px]' },
              ].map((f, i) => (
                <select
                  key={i}
                  className={`${f.width} h-[36px] px-3 pr-8 border border-border rounded-lg text-sm outline-none bg-bg-layout appearance-none bg-no-repeat bg-[position:right_10px_center] transition-all duration-200 hover:border-primary-outline focus:border-primary focus:bg-white`}
                  style={selectArrow}
                  value={f.value}
                  onChange={(e) => { f.set(e.target.value); setPage(1); }}
                >
                  {f.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ))}
            </div>
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto">
            {paged.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bg-layout flex items-center justify-center">
                  <svg className="w-8 h-8 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12h6"/></svg>
                </div>
                <div className="text-text-secondary text-sm">没有找到匹配的设备</div>
                <div className="text-text-tertiary text-xs mt-1">尝试调整搜索条件或筛选器</div>
              </div>
            ) : (
              <table className="table-default">
                <thead>
                  <tr>
                    <th className="w-[52px]">#</th>
                    <th>设备名称</th>
                    <th>型号/编号</th>
                    <th className="w-[70px]">数量</th>
                    <th>所在地</th>
                    <th>负责人</th>
                    <th className="w-[85px]">状态</th>
                    <th>更新日期</th>
                    <th className="w-[120px] text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((item, i) => (
                    <tr key={item.id}>
                      <td className="text-text-tertiary text-xs font-medium">{(page - 1) * pageSize + i + 1}</td>
                      <td>
                        <Link href={`/equipment/${item.id}`} className="text-text-primary no-underline font-medium hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                      </td>
                      <td className="text-text-secondary">{item.model || '-'}</td>
                      <td className="text-text-secondary">{item.quantity}台</td>
                      <td>{item.location}</td>
                      <td className="text-text-secondary">{item.responsible_person}</td>
                      <td><span className={`tag ${statusTag(item.status)}`}>{item.status}</span></td>
                      <td className="text-text-tertiary text-[13px]">
                        {new Date(item.updated_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-1.5">
                          <Link href={`/equipment/${item.id}`} className="inline-flex items-center px-3 py-1 text-[13px] font-medium text-primary bg-primary-bg hover:bg-primary hover:text-white rounded-md transition-all no-underline">详情</Link>
                          <Link href={`/equipment/${item.id}/edit`} className="inline-flex items-center px-3 py-1 text-[13px] font-medium text-primary bg-primary-bg hover:bg-primary hover:text-white rounded-md transition-all no-underline">编辑</Link>
                        </div>
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
