export default function DeadlineItem() {
  return (
    <div className="flex items-center justify-between bg-white border border-[#e6e2f0] rounded-lg p-4">
      <div>
        <p className="text-sm font-medium text-gray-900">
          Chevening Scholarship
        </p>
        <p className="text-xs text-gray-500">Closes in 5 days</p>
      </div>

      <span className="text-xs font-medium text-red-500">Urgent</span>
    </div>
  );
}
