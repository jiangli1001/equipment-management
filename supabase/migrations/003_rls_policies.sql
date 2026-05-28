-- 开放设备表的所有操作（内部小团队，全员管理员权限）
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on equipment" ON equipment FOR ALL USING (true) WITH CHECK (true);

-- 开放变更记录表
ALTER TABLE change_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on change_logs" ON change_logs FOR ALL USING (true) WITH CHECK (true);

-- 开放用户表
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true) WITH CHECK (true);
