import React from 'react';

export default function PriceDisplay({ amount, className = "" }) {
  const numericAmount = Number(amount) || 0;
  
  // Format to standard US currency e.g., 1,500.00
  const formatted = numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const [integerPart, decimalPart] = formatted.split('.');

  return (
    <div className={`flex items-start ${className}`}>
      <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
        ${integerPart}
      </span>
      <sup className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-1 ml-0.5">
        .{decimalPart}
      </sup>
    </div>
  );
}
