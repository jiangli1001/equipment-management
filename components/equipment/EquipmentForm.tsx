'use client';

import { useActionState } from 'react';
import type { Equipment } from '@/lib/types';

interface Props {
  equipment?: Equipment | null;
  action: (prevState: unknown, formData: FormData) => Promise<{ error?: string } | undefined>;
  submitLabel: string;
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="inline-flex items-center h-[34px] px-4 bg-primary text-white rounded-md text-sm cursor-pointer transition-all duration-200 hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}

export default function EquipmentForm({ equipment, action, submitLabel }: Props) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="mb-4 p-2.5 bg-error-bg border border-error-border rounded-md text-sm text-error">
          {state.error}
        </div>
      )}

      <div className="form-row">
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-primary">
            设备名称<span className="text-error ml-0.5">*</span>
          </label>
          <input
            className="w-full h-[34px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none transition-colors duration-200 hover:border-primary-hover focus:border-primary focus:shadow-[0_0_0_2px_var(--color-primary-bg)]"
            type="text"
            name="name"
            defaultValue={equipment?.name || ''}
            placeholder="如：RTK、无人机"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-primary">型号/编号</label>
          <input
            className="w-full h-[34px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none transition-colors duration-200 hover:border-primary-hover focus:border-primary focus:shadow-[0_0_0_2px_var(--color-primary-bg)]"
            type="text"
            name="model"
            defaultValue={equipment?.model || ''}
            placeholder="如：大疆Air3"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-primary">数量</label>
          <input
            className="w-full h-[34px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none transition-colors duration-200 hover:border-primary-hover focus:border-primary focus:shadow-[0_0_0_2px_var(--color-primary-bg)]"
            type="number"
            name="quantity"
            defaultValue={equipment?.quantity || 1}
            min={0}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-primary">
            状态<span className="text-error ml-0.5">*</span>
          </label>
          <select
            className="w-full h-[34px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none appearance-none bg-no-repeat bg-[position:right_12px_center] pr-8 transition-colors duration-200 hover:border-primary-hover focus:border-primary focus:shadow-[0_0_0_2px_var(--color-primary-bg)]"
            name="status"
            defaultValue={equipment?.status || '正常'}
            required
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='rgba(0,0,0,0.25)'/%3E%3C/svg%3E")` }}
          >
            <option>正常</option>
            <option>维修中</option>
            <option>已报废</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-primary">
            所在地<span className="text-error ml-0.5">*</span>
          </label>
          <input
            className="w-full h-[34px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none transition-colors duration-200 hover:border-primary-hover focus:border-primary focus:shadow-[0_0_0_2px_var(--color-primary-bg)]"
            type="text"
            name="location"
            defaultValue={equipment?.location || ''}
            placeholder="如：办公室415"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-text-primary">
            负责人<span className="text-error ml-0.5">*</span>
          </label>
          <input
            className="w-full h-[34px] px-3 border border-[#D9D9D9] rounded-md text-sm outline-none transition-colors duration-200 hover:border-primary-hover focus:border-primary focus:shadow-[0_0_0_2px_var(--color-primary-bg)]"
            type="text"
            name="responsible_person"
            defaultValue={equipment?.responsible_person || ''}
            placeholder="输入负责人姓名"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm text-text-primary">备注</label>
        <textarea
          className="w-full h-auto min-h-[80px] px-3 py-2 border border-[#D9D9D9] rounded-md text-sm outline-none resize-y transition-colors duration-200 hover:border-primary-hover focus:border-primary focus:shadow-[0_0_0_2px_var(--color-primary-bg)]"
          name="remarks"
          defaultValue={equipment?.remarks || ''}
          placeholder="选填，补充说明信息"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-6 mt-6 border-t border-border">
        <a
          href="/"
          className="inline-flex items-center h-[34px] px-4 bg-white text-text-primary border border-[#D9D9D9] rounded-md text-sm no-underline cursor-pointer transition-all duration-200 hover:text-primary hover:border-primary"
        >
          取消
        </a>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
