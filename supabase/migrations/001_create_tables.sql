-- 仪器设备管理系统 — 数据库初始化
-- 在 Supabase SQL Editor 中执行此文件

-- 1. 设备表
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  model TEXT DEFAULT '',
  quantity INT DEFAULT 1,
  location TEXT NOT NULL,
  responsible_person TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '正常' CHECK (status IN ('正常', '维修中', '已报废')),
  remarks TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 变更记录表
CREATE TABLE IF NOT EXISTS change_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value TEXT DEFAULT '',
  new_value TEXT DEFAULT '',
  changed_by TEXT DEFAULT '',
  changed_at TIMESTAMPTZ DEFAULT now(),
  remark TEXT DEFAULT ''
);

-- 3. 用户表（可选，后续认证功能使用）
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_person ON equipment(responsible_person);
CREATE INDEX IF NOT EXISTS idx_change_logs_equipment ON change_logs(equipment_id);
CREATE INDEX IF NOT EXISTS idx_change_logs_time ON change_logs(changed_at DESC);
