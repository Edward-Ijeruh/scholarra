export default function ScholarshipCard() {
  return (
    <div className="bg-white border border-[#e6e2f0] rounded-xl p-5 hover:shadow-sm transition">
      <h3 className="font-medium text-gray-900">
        Mastercard Foundation Scholarship
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        Fully funded · Worldwide · Undergraduate
      </p>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-500">Deadline: 20 Oct 2026</span>

        <button className="text-sm font-medium text-[#8f6cd0] hover:underline cursor-pointer">
          View details
        </button>
      </div>
    </div>
  );
}
