import Header from '@/components/layout/Header';
import EquipmentForm from '@/components/equipment/EquipmentForm';
import { updateEquipment } from '@/lib/actions/equipment';
import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEquipmentPage({ params }: Props) {
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

  const boundAction = updateEquipment.bind(null, id);

  return (
    <>
      <Header />
      <div className="p-6">
        <div className="bg-bg-container rounded-lg shadow-sm border border-border max-w-[720px]">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-semibold text-text-primary m-0">
              编辑设备 — {equipment.name}（{equipment.model || equipment.id.slice(0, 8)}）
            </h3>
          </div>
          <div className="px-6 py-6">
            <EquipmentForm equipment={equipment} action={boundAction} submitLabel="保存修改" />
          </div>
        </div>
      </div>
    </>
  );
}
