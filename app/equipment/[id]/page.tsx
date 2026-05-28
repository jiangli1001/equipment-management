import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import ChangeTimeline from '@/components/equipment/ChangeTimeline';
import DeleteButton from '@/components/equipment/DeleteButton';
import { createServerSupabase } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ id: string }>;
}

const statusTag = (status: string) => {
  if (status === '维修中') return 'tag-warning';
  if (status === '已报废') return 'tag-error';
  return 'tag-success';
};

export default async function EquipmentDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', id)
    .single();

  if (!equipment) {
    notFound();
  }

  const { data: logs } = await supabase
    .from('change_logs')
    .select('*')
    .eq('equipment_id', id)
    .order('changed_at', { ascending: false });

  return (
    <>
      <Header
        extra={
          <div className="flex items-center gap-2">
            <Link
              href={`/equipment/${id}/edit`}
              className="inline-flex items-center h-[34px] px-4 bg-white text-text-primary border border-[#D9D9D9] rounded-md text-sm no-underline transition-all duration-200 hover:text-primary hover:border-primary"
            >
              编辑
            </Link>
            <DeleteButton equipmentId={id} />
          </div>
        }
      />

      <div className="p-6">
        {/* 设备信息卡片 */}
        <div className="bg-bg-container rounded-lg shadow-sm border border-border mb-6">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-semibold text-text-primary m-0">
              设备信息 — {equipment.name}（{equipment.model || '-'}）
            </h3>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex py-1">
                <span className="w-20 flex-shrink-0 text-sm text-text-secondary">设备名称</span>
                <span className="flex-1 text-sm text-text-primary">{equipment.name}</span>
              </div>
              <div className="flex py-1">
                <span className="w-20 flex-shrink-0 text-sm text-text-secondary">型号/编号</span>
                <span className="flex-1 text-sm text-text-primary">{equipment.model || '-'}</span>
              </div>
              <div className="flex py-1">
                <span className="w-20 flex-shrink-0 text-sm text-text-secondary">数量</span>
                <span className="flex-1 text-sm text-text-primary">{equipment.quantity}台</span>
              </div>
              <div className="flex py-1">
                <span className="w-20 flex-shrink-0 text-sm text-text-secondary">当前状态</span>
                <span className={`tag ${statusTag(equipment.status)}`}>{equipment.status}</span>
              </div>
              <div className="flex py-1">
                <span className="w-20 flex-shrink-0 text-sm text-text-secondary">所在地</span>
                <span className="flex-1 text-sm text-text-primary">{equipment.location}</span>
              </div>
              <div className="flex py-1">
                <span className="w-20 flex-shrink-0 text-sm text-text-secondary">负责人</span>
                <span className="flex-1 text-sm text-text-primary">{equipment.responsible_person}</span>
              </div>
              <div className="flex py-1">
                <span className="w-20 flex-shrink-0 text-sm text-text-secondary">更新时间</span>
                <span className="flex-1 text-sm text-text-secondary">
                  {new Date(equipment.updated_at).toLocaleString('zh-CN')}
                </span>
              </div>
              <div className="flex py-1">
                <span className="w-20 flex-shrink-0 text-sm text-text-secondary">登记时间</span>
                <span className="flex-1 text-sm text-text-secondary">
                  {new Date(equipment.created_at).toLocaleString('zh-CN')}
                </span>
              </div>
              {equipment.remarks && (
                <div className="flex py-1 col-span-2">
                  <span className="w-20 flex-shrink-0 text-sm text-text-secondary">备注</span>
                  <span className="flex-1 text-sm text-text-secondary">{equipment.remarks}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 流转记录卡片 */}
        <div className="bg-bg-container rounded-lg shadow-sm border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-semibold text-text-primary m-0">流转记录</h3>
          </div>
          <div className="px-6 py-4">
            <ChangeTimeline logs={logs ?? []} />
          </div>
        </div>
      </div>
    </>
  );
}
