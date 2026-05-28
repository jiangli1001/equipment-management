'use client';

import { useState } from 'react';
import { deleteEquipment } from '@/lib/actions/equipment';

export default function DeleteButton({ equipmentId }: { equipmentId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-sm text-text-secondary">确认删除？</span>
        <button
          className="inline-flex items-center h-[34px] px-4 bg-error text-white rounded-md text-sm cursor-pointer transition-all duration-200 hover:opacity-80 border-0"
          onClick={() => deleteEquipment(equipmentId)}
        >
          确认
        </button>
        <button
          className="inline-flex items-center h-[34px] px-4 bg-white text-text-primary border border-[#D9D9D9] rounded-md text-sm cursor-pointer transition-all duration-200 hover:text-primary hover:border-primary"
          onClick={() => setShowConfirm(false)}
        >
          取消
        </button>
      </span>
    );
  }

  return (
    <button
      className="inline-flex items-center h-[34px] px-4 bg-white text-error border border-error rounded-md text-sm cursor-pointer transition-all duration-200 hover:bg-error hover:text-white"
      onClick={() => setShowConfirm(true)}
    >
      删除设备
    </button>
  );
}
