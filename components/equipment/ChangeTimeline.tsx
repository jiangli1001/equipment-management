import type { ChangeLog } from '@/lib/types';

function dotClass(fieldName: string, newValue: string) {
  if (fieldName === '状态') {
    if (newValue === '正常') return 'bg-success border-success';
    if (newValue === '维修中') return 'bg-warning border-warning';
    if (newValue === '已报废') return 'bg-error border-error';
  }
  return 'bg-primary border-primary';
}

function formatValue(fieldName: string, oldVal: string, newVal: string) {
  if (!oldVal) {
    return <span>初始登记：<strong>{newVal}</strong></span>;
  }
  return (
    <span>
      {fieldName}：<span className="text-text-tertiary line-through mr-1.5">{oldVal}</span>
      <span className="text-text-tertiary mx-1">→</span>
      <strong>{newVal}</strong>
    </span>
  );
}

export default function ChangeTimeline({ logs }: { logs: ChangeLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="py-12 text-center text-text-tertiary text-sm">
        暂无变更记录
      </div>
    );
  }

  return (
    <div className="py-1">
      {logs.map((log, i) => (
        <div key={log.id} className="flex pb-6 relative">
          <div className={`timeline-dot ${dotClass(log.field_name, log.new_value)}`} />
          {i < logs.length - 1 && <div className="timeline-line" />}
          <div className="ml-4 flex-1">
            <div className="text-xs text-text-tertiary mb-0.5">
              {new Date(log.changed_at).toLocaleString('zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit',
              })}
            </div>
            <div className="text-sm text-text-primary">
              {formatValue(log.field_name, log.old_value, log.new_value)}
            </div>
            <div className="text-xs text-text-secondary mt-0.5">
              操作人：{log.changed_by || '---'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
