import { LucideIcon } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <div className="bg-white border border-[#e6e2f0] rounded-xl p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#f0ebff] flex items-center justify-center">
        <Icon size={20} className="text-[#8f6cd0]" />
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
