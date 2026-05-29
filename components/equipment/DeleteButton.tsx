'use client';

import { useState } from 'react';
import { deleteEquipment } from '@/lib/actions/equipment';

export default function DeleteButton({ equipmentId }: { equipmentId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-[13px] text-text-secondary">确认删除此设备？</span>
        <button
          className="inline-flex items-center h-[36px] px-5 bg-error text-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-red-600 border-0"
          onClick={() => deleteEquipment(equipmentId)}
        >确认</button>
        <button
          className="inline-flex items-center h-[36px] px-5 bg-white text-text-primary border border-border rounded-lg text-sm cursor-pointer transition-all duration-200 hover:text-primary hover:border-primary"
          onClick={() => setShowConfirm(false)}
        >取消</button>
      </span>
    );
  }

  return (
    <button
      className="inline-flex items-center h-[36px] px-5 bg-white text-error border border-error/20 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-error hover:text-white hover:border-error"
      onClick={() => setShowConfirm(true)}
    >
      删除设备
    </button>
  );
}
