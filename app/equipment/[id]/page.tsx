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

const detailFields = [
  { key: 'name', label: '设备名称' },
  { key: 'model', label: '型号/编号' },
  { key: 'quantity', label: '数量', format: (v: unknown) => `${v}台` },
  { key: 'status', label: '当前状态' },
  { key: 'location', label: '所在地' },
  { key: 'responsible_person', label: '负责人' },
];

export default async function EquipmentDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', id)
    .single();

  if (!equipment) notFound();

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
              className="inline-flex items-center h-[36px] px-5 bg-white text-text-primary border border-border rounded-lg text-sm font-medium no-underline transition-all duration-200 hover:text-primary hover:border-primary hover:shadow-sm"
            >
              编辑设备
            </Link>
            <DeleteButton equipmentId={id} />
          </div>
        }
      />

      <div className="p-6 animate-fadeIn">
        {/* 设备信息卡片 */}
        <div className="bg-bg-container rounded-xl border border-border overflow-hidden mb-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-text-primary m-0">
                {equipment.name}
              </h3>
              <p className="text-[13px] text-text-tertiary mt-0.5">
                {equipment.model || '无型号'} · 登记于 {new Date(equipment.created_at).toLocaleDateString('zh-CN')}
              </p>
            </div>
            <span className={`tag ${statusTag(equipment.status)}`}>{equipment.status}</span>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <span className="text-xs text-text-tertiary mb-1 uppercase tracking-wider">所在地</span>
                <span className="text-sm font-medium text-text-primary">{equipment.location}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-tertiary mb-1 uppercase tracking-wider">负责人</span>
                <span className="text-sm font-medium text-text-primary">{equipment.responsible_person}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-tertiary mb-1 uppercase tracking-wider">数量</span>
                <span className="text-sm font-medium text-text-primary">{equipment.quantity}台</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-tertiary mb-1 uppercase tracking-wider">型号/编号</span>
                <span className="text-sm font-medium text-text-primary">{equipment.model || '-'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-tertiary mb-1 uppercase tracking-wider">最后更新</span>
                <span className="text-sm font-medium text-text-primary">
                  {new Date(equipment.updated_at).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            {equipment.remarks && (
              <div className="mt-4 pt-4 border-t border-divider">
                <span className="text-xs text-text-tertiary mb-1 block uppercase tracking-wider">备注</span>
                <span className="text-sm text-text-secondary">{equipment.remarks}</span>
              </div>
            )}
          </div>
        </div>

        {/* 流转记录 */}
        <div className="bg-bg-container rounded-xl border border-border overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="px-6 py-4 border-b border-divider">
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
