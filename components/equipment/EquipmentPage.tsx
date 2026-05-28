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
  { key: 'total', label: '设备总数', color: 'blue' },
  { key: 'normal', label: '正常在用', color: 'green' },
  { key: 'repairing', label: '维修中', color: 'orange' },
  { key: 'scrapped', label: '已报废', color: 'red' },
] as const;

const statIcons: Record<string, React.ReactNode> = {
  blue: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>,
  green: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>,
  orange: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16" r="0.5"/></svg>,
  red: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>,
};

const statColors: Record<string, string> = {
  blue: 'bg-primary-bg text-primary',
  green: 'bg-success-bg text-success',
  orange: 'bg-warning-bg text-warning',
  red: 'bg-error-bg text-error',
};

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

  // 提取筛选选项
  const persons = useMemo(() => [...new Set(equipment.map((e) => e.responsible_person))], [equipment]);
  const locations = useMemo(() => [...new Set(equipment.map((e) => e.location))], [equipment]);

  // 筛选
  const filtered = useMemo(() => {
    return equipment.filter((e) => {
      if (search && !e.name.includes(search) && !e.model.includes(search) && !e.location.includes(search)) {
        return false;
      }
      if (statusFilter !== '全部状态' && e.status !== statusFilter) return false;
      if (personFilter !== '全部负责人' && e.responsible_person !== personFilter) return false;
      if (locationFilter !== '全部地点' && e.location !== locationFilter) return false;
      return true;
    });
  }, [equipment, search, statusFilter, personFilter, locationFilter]);

  // 分页
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Header
        extra={
          <Link
            href="/equipment/new"
            className="inline-flex items-center gap-1 px-4 h-[34px] bg-primary text-white rounded-md text-sm no-underline transition-all duration-200 hover:bg-primary-hover"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            新增设备
          </Link>
        }
      />

      <div className="p-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statConfig.map(({ key, label, color }) => (
            <div key={key} className="bg-bg-container rounded-lg p-6 shadow-sm border border-border flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${statColors[color]}`}>
                {statIcons[color]}
              </div>
              <div>
                <div className="text-[28px] font-bold leading-tight">{stats[key]}</div>
                <div className="text-[13px] text-text-secondary mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 表格卡片 */}
        <div className="bg-bg-container rounded-lg shadow-sm border border-border">
          {/* 工具栏 */}
          <div className="flex items-center justify-between px-6 py-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <input
                className="h-[34px] w-60 px-3 border border-border rounded-md text-sm outline-none transition-colors duration-200 hover:border-primary-hover focus:border-primary focus:shadow-[0_0_0_2px_var(--color-primary-bg)]"
                type="text"
                placeholder="搜索设备名称 / 型号 / 地点..."
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
                className="h-[34px] w-[120px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none appearance-none bg-no-repeat bg-[position:right_12px_center] pr-8 transition-colors duration-200 hover:border-primary-hover focus:border-primary"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='rgba(0,0,0,0.25)'/%3E%3C/svg%3E")` }}
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option>全部状态</option>
                <option>正常</option>
                <option>维修中</option>
                <option>已报废</option>
              </select>
              <select
                className="h-[34px] w-[140px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none appearance-none bg-no-repeat bg-[position:right_12px_center] pr-8 transition-colors duration-200 hover:border-primary-hover focus:border-primary"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='rgba(0,0,0,0.25)'/%3E%3C/svg%3E")` }}
                value={personFilter}
                onChange={(e) => { setPersonFilter(e.target.value); setPage(1); }}
              >
                <option>全部负责人</option>
                {persons.map((p) => <option key={p}>{p}</option>)}
              </select>
              <select
                className="h-[34px] w-[160px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none appearance-none bg-no-repeat bg-[position:right_12px_center] pr-8 transition-colors duration-200 hover:border-primary-hover focus:border-primary"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='rgba(0,0,0,0.25)'/%3E%3C/svg%3E")` }}
                value={locationFilter}
                onChange={(e) => { setLocationFilter(e.target.value); setPage(1); }}
              >
                <option>全部地点</option>
                {locations.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto">
            {paged.length === 0 ? (
              <div className="py-16 text-center text-text-tertiary">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-20" viewBox="0 0 64 64" fill="currentColor"><rect x="2" y="2" width="60" height="60" rx="4"/><path d="M20 32h24M32 20v24" stroke="#fff" strokeWidth="3" fill="none"/></svg>
                没有找到匹配的设备
              </div>
            ) : (
              <table className="table-default">
                <thead>
                  <tr>
                    <th className="w-[50px]">序号</th>
                    <th>设备名称</th>
                    <th>型号/编号</th>
                    <th className="w-[80px]">数量</th>
                    <th>所在地</th>
                    <th>负责人</th>
                    <th className="w-[80px]">状态</th>
                    <th>更新日期</th>
                    <th className="w-[120px]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((item, i) => (
                    <tr key={item.id}>
                      <td>{(page - 1) * pageSize + i + 1}</td>
                      <td>
                        <Link href={`/equipment/${item.id}`} className="text-text-primary no-underline font-medium hover:text-primary">
                          {item.name}
                        </Link>
                      </td>
                      <td>{item.model || '-'}</td>
                      <td>{item.quantity}台</td>
                      <td>{item.location}</td>
                      <td>{item.responsible_person}</td>
                      <td>
                        <span className={`tag ${statusTag(item.status)}`}>{item.status}</span>
                      </td>
                      <td className="text-text-secondary">{new Date(item.updated_at).toLocaleDateString('zh-CN')}</td>
                      <td>
                        <Link href={`/equipment/${item.id}`} className="inline-flex items-center px-1 h-[34px] text-sm text-primary no-underline hover:text-primary-hover">详情</Link>
                        <Link href={`/equipment/${item.id}/edit`} className="inline-flex items-center px-1 h-[34px] text-sm text-primary no-underline hover:text-primary-hover">编辑</Link>
                      </td>
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
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`min-w-[32px] h-8 inline-flex items-center justify-center border rounded-md text-sm transition-colors duration-200 cursor-pointer ${page === p ? 'bg-primary text-white border-primary' : 'bg-white border-border hover:text-primary hover:border-primary'}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className={`min-w-[32px] h-8 inline-flex items-center justify-center border border-border rounded-md bg-white text-sm transition-colors duration-200 ${page >= totalPages ? 'text-text-disabled cursor-not-allowed' : 'cursor-pointer hover:text-primary hover:border-primary'}`}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
