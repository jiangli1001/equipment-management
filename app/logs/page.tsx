import { createServerSupabase } from '@/lib/supabase/server';
import LogsPageClient from '@/components/logs/LogsPageClient';

export default async function LogsPage() {
  const supabase = await createServerSupabase();

  const { data: logs } = await supabase
    .from('change_logs')
    .select('*')
    .order('changed_at', { ascending: false });

  // 获取所有相关设备名称（按 equipment_id 去重）
  const equipmentIds = [...new Set((logs ?? []).map((l) => l.equipment_id))];
  const { data: equipment } = await supabase
    .from('equipment')
    .select('id, name, model')
    .in('id', equipmentIds.length > 0 ? equipmentIds : ['none']);

  // 构建 id → 名称映射
  const nameMap: Record<string, string> = {};
  (equipment ?? []).forEach((e) => {
    nameMap[e.id] = e.model ? `${e.name}（${e.model}）` : e.name;
  });

  return <LogsPageClient logs={logs ?? []} nameMap={nameMap} />;
}
