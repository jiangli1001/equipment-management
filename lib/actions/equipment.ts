'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';

type ActionResult = { error?: string };

export async function createEquipment(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult | undefined> {
  const supabase = await createServerSupabase();

  const name = formData.get('name') as string;
  const model = (formData.get('model') as string) || '';
  const quantity = parseInt((formData.get('quantity') as string) || '1', 10);
  const location = formData.get('location') as string;
  const responsiblePerson = formData.get('responsible_person') as string;
  const status = formData.get('status') as string;
  const remarks = (formData.get('remarks') as string) || '';

  if (!name || !location || !responsiblePerson || !status) {
    return { error: '设备名称、所在地、负责人和状态为必填项' };
  }

  const { error } = await supabase.from('equipment').insert({
    name,
    model,
    quantity,
    location,
    responsible_person: responsiblePerson,
    status,
    remarks,
  });

  if (error) {
    return { error: `保存失败：${error.message}` };
  }

  revalidatePath('/');
  redirect('/');
}

export async function updateEquipment(
  equipmentId: string,
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult | undefined> {
  const supabase = await createServerSupabase();

  const name = formData.get('name') as string;
  const model = (formData.get('model') as string) || '';
  const quantity = parseInt((formData.get('quantity') as string) || '1', 10);
  const location = formData.get('location') as string;
  const responsiblePerson = formData.get('responsible_person') as string;
  const status = formData.get('status') as string;
  const remarks = (formData.get('remarks') as string) || '';

  if (!name || !location || !responsiblePerson || !status) {
    return { error: '设备名称、所在地、负责人和状态为必填项' };
  }

  const { data: current } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', equipmentId)
    .single();

  if (!current) {
    return { error: '设备不存在' };
  }

  const { data: authData } = await supabase.auth.getUser();
  const changedBy = (authData.user?.email || 'unknown').replace('@team.eq', '');

  const newValues: Record<string, string> = {
    name,
    model: model || '',
    location,
    responsible_person: responsiblePerson,
    status,
    remarks: remarks || '',
  };
  const oldValues: Record<string, string> = {
    name: current.name,
    model: current.model || '',
    location: current.location,
    responsible_person: current.responsible_person,
    status: current.status,
    remarks: current.remarks || '',
  };

  const fieldLabels: Record<string, string> = {
    name: '设备名称',
    model: '型号/编号',
    location: '所在地',
    responsible_person: '负责人',
    status: '状态',
    remarks: '备注',
  };

  const changeLogs: { equipment_id: string; field_name: string; old_value: string; new_value: string; changed_by: string }[] = [];

  for (const [field, newVal] of Object.entries(newValues)) {
    const oldVal = oldValues[field];
    if (String(oldVal) !== String(newVal)) {
      changeLogs.push({
        equipment_id: equipmentId,
        field_name: fieldLabels[field] || field,
        old_value: String(oldVal),
        new_value: String(newVal),
        changed_by: changedBy,
      });
    }
  }

  const { error } = await supabase
    .from('equipment')
    .update({
      name,
      model,
      quantity,
      location,
      responsible_person: responsiblePerson,
      status,
      remarks,
      updated_at: new Date().toISOString(),
    })
    .eq('id', equipmentId);

  if (error) {
    return { error: `保存失败：${error.message}` };
  }

  if (changeLogs.length > 0) {
    await supabase.from('change_logs').insert(changeLogs);
  }

  revalidatePath('/');
  revalidatePath(`/equipment/${equipmentId}`);
  redirect('/');
}

export async function deleteEquipment(equipmentId: string) {
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from('equipment')
    .delete()
    .eq('id', equipmentId);

  if (error) {
    return { error: `删除失败：${error.message}` };
  }

  revalidatePath('/');
  redirect('/');
}
