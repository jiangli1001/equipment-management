'use client';

import { useActionState } from 'react';
import type { Equipment } from '@/lib/types';

interface Props {
  equipment?: Equipment | null;
  action: (prevState: unknown, formData: FormData) => Promise<{ error?: string } | undefined>;
  submitLabel: string;
}

export default function EquipmentForm({ equipment, action, submitLabel }: Props) {
  const [state, formAction] = useActionState(action, null);

  const selectArrow = { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%2394A3B8'/%3E%3C/svg%3E")` };
  const inputClass = "w-full h-[38px] px-3.5 border border-border rounded-lg text-sm outline-none bg-bg-layout transition-all duration-200 hover:border-primary-outline focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-bg)]";

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="mb-5 p-3 bg-error-bg border border-error-border rounded-lg text-sm text-error flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
          {state.error}
        </div>
      )}

      <div className="form-row">
        <div className="mb-4">
          <label className="block mb-1.5 text-[13px] font-medium text-text-primary">
            设备名称<span className="text-error ml-0.5">*</span>
          </label>
          <input className={inputClass} type="text" name="name" defaultValue={equipment?.name || ''} placeholder="如：RTK、无人机" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1.5 text-[13px] font-medium text-text-primary">型号/编号</label>
          <input className={inputClass} type="text" name="model" defaultValue={equipment?.model || ''} placeholder="如：大疆Air3" />
        </div>
      </div>

      <div className="form-row">
        <div className="mb-4">
          <label className="block mb-1.5 text-[13px] font-medium text-text-primary">数量</label>
          <input className={inputClass} type="number" name="quantity" defaultValue={equipment?.quantity || 1} min={0} />
        </div>
        <div className="mb-4">
          <label className="block mb-1.5 text-[13px] font-medium text-text-primary">
            状态<span className="text-error ml-0.5">*</span>
          </label>
          <select className={`${inputClass} appearance-none bg-no-repeat bg-[position:right_12px_center] pr-9`} name="status" defaultValue={equipment?.status || '正常'} required style={selectArrow}>
            <option>正常</option><option>维修中</option><option>已报废</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="mb-4">
          <label className="block mb-1.5 text-[13px] font-medium text-text-primary">
            所在地<span className="text-error ml-0.5">*</span>
          </label>
          <input className={inputClass} type="text" name="location" defaultValue={equipment?.location || ''} placeholder="如：办公室415" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1.5 text-[13px] font-medium text-text-primary">
            负责人<span className="text-error ml-0.5">*</span>
          </label>
          <input className={inputClass} type="text" name="responsible_person" defaultValue={equipment?.responsible_person || ''} placeholder="输入负责人姓名" required />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1.5 text-[13px] font-medium text-text-primary">备注</label>
        <textarea className={`${inputClass} min-h-[90px] py-2.5 resize-y`} name="remarks" defaultValue={equipment?.remarks || ''} placeholder="选填，补充说明信息" rows={3} />
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-5 mt-5 border-t border-divider">
        <a href="/" className="inline-flex items-center h-[38px] px-5 bg-white text-text-primary border border-border rounded-lg text-sm font-medium no-underline transition-all duration-200 hover:text-primary hover:border-primary">
          取消
        </a>
        <button type="submit" className="inline-flex items-center h-[38px] px-6 bg-primary text-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 border-0">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
