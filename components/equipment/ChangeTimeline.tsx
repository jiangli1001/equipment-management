import type { ChangeLog } from '@/lib/types';

function dotClass(fieldName: string, newValue: string) {
  if (fieldName === '状态') {
    if (newValue === '正常') return 'bg-success border-success';
    if (newValue === '维修中') return 'bg-warning border-warning';
    if (newValue === '已报废') return 'bg-error border-error';
  }
  return 'bg-primary border-primary';
}

export default function ChangeTimeline({ logs }: { logs: ChangeLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="py-14 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-bg-layout flex items-center justify-center">
          <svg className="w-6 h-6 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
        </div>
        <div className="text-text-secondary text-sm">暂无变更记录</div>
        <div className="text-text-tertiary text-xs mt-1">设备操作记录将显示在此处</div>
      </div>
    );
  }

  return (
    <div className="py-1">
      {logs.map((log, i) => (
        <div key={log.id} className="flex pb-6 relative">
          <div className={`timeline-dot ${dotClass(log.field_name, log.new_value)}`} />
          {i < logs.length - 1 && <div className="timeline-line" />}
          <div className="ml-4 flex-1 min-w-0">
            <div className="text-xs text-text-tertiary mb-1 font-medium tracking-wide">
              {new Date(log.changed_at).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-text-primary leading-relaxed">
              {log.old_value ? (
                <span className="inline-flex items-center gap-1.5 flex-wrap">
                  <span className="text-text-tertiary line-through">{log.old_value}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary flex-shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  <span className="text-text-primary font-medium">{log.new_value}</span>
                  <span className="text-text-tertiary text-xs">({log.field_name})</span>
                </span>
              ) : (
                <span>初始登记 · <span className="font-medium">{log.new_value}</span></span>
              )}
            </div>
            <div className="text-xs text-text-tertiary mt-1">
              {log.changed_by || '---'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
