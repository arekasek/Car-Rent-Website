import React from "react";
import { PiSquaresFourLight } from "react-icons/pi";
import { PiSquareSplitVertical } from "react-icons/pi";

export default function SortingBar({ onSortChange, onColsChange }) {
  const [value, setValue] = React.useState("");

  const handle = (e) => {
    const v = e.target.value;
    setValue(v);
    if (typeof onSortChange === "function") onSortChange(v);
  };

  return (
    <div className="w-full bg-slate-500/10 h-[10vh] card-item-shadow flex items-center justify-center">
      <button
        className="bg-white/90 p-2 rounded-lg mx-4"
        onClick={() => onColsChange?.((prev) => (prev === 2 ? 1 : 2))}
      >
        <PiSquaresFourLight className="text-2xl" />
      </button>
      <select
        value={value}
        onChange={handle}
        className="bg-white/90 p-2 rounded-lg mx-4"
        aria-label="Sort cars"
      >
        <option value="">Sort by</option>
        <option value="price-asc">Price (low → high)</option>
        <option value="price-desc">Price (high → low)</option>
        <option value="brand-asc">Brand (A → Z)</option>
        <option value="brand-desc">Brand (Z → A)</option>
        <option value="seats-asc">Seats (few → many)</option>
        <option value="seats-desc">Seats (many → few)</option>
      </select>
    </div>
  );
}
