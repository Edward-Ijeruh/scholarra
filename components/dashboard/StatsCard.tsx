import { LucideIcon } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="bg-white border border-[#e6e2f0] rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4">
      <div
        className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon size={18} className={`${iconColor} md:w-5 md:h-5`} />
      </div>

      <div className="min-w-0">
        <p className="text-xs md:text-sm text-gray-500 truncate">{title}</p>
        <p className="text-lg md:text-xl font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
