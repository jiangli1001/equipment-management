import { createServerSupabase } from '@/lib/supabase/server';
import EquipmentPage from '@/components/equipment/EquipmentPage';

export default async function Home() {
  const supabase = await createServerSupabase();

  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: true });

  const total = equipment?.length ?? 0;
  const normal = equipment?.filter((e) => e.status === '正常').length ?? 0;
  const repairing = equipment?.filter((e) => e.status === '维修中').length ?? 0;
  const scrapped = equipment?.filter((e) => e.status === '已报废').length ?? 0;

  const stats = { total, normal, repairing, scrapped };

  return <EquipmentPage equipment={equipment ?? []} stats={stats} />;
}
