"use client";

import { useState } from "react";

export function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#e6e2f0] rounded-2xl bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left font-medium text-gray-900 hover:bg-[#f0edfb] rounded-2xl"
      >
        {question}
        <span className="ml-2 text-gray-500">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="p-5 pt-2 border-t border-[#e6e2f0]">{answer}</div>
      )}
    </div>
  );
}
