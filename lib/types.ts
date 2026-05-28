export interface Equipment {
  id: string;
  name: string;
  model: string;
  quantity: number;
  location: string;
  responsible_person: string;
  status: '正常' | '维修中' | '已报废';
  remarks: string;
  created_at: string;
  updated_at: string;
}

export interface ChangeLog {
  id: string;
  equipment_id: string;
  field_name: string;
  old_value: string;
  new_value: string;
  changed_by: string;
  changed_at: string;
  remark: string;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  password_hash: string;
  created_at: string;
}
