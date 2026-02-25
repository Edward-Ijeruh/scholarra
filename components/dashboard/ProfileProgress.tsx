export default function ProfileProgress({ percent }: { percent: number }) {
  return (
    <div className="bg-white border border-[#e6e2f0] rounded-xl p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Profile completion</p>
        <p className="text-lg font-semibold text-gray-900 mt-1">
          {percent}% complete
        </p>
      </div>

      <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full bg-[#8f6cd0]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
