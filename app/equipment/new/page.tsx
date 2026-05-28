import Header from '@/components/layout/Header';
import EquipmentForm from '@/components/equipment/EquipmentForm';
import { createEquipment } from '@/lib/actions/equipment';

export default function NewEquipmentPage() {
  return (
    <>
      <Header />
      <div className="p-6">
        <div className="bg-bg-container rounded-lg shadow-sm border border-border max-w-[720px]">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-semibold text-text-primary m-0">新增设备</h3>
          </div>
          <div className="px-6 py-6">
            <EquipmentForm action={createEquipment} submitLabel="保存" />
          </div>
        </div>
      </div>
    </>
  );
}
