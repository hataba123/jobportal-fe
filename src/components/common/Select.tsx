// src/components/common/Select.tsx
import React from "react";

// Kiểu dữ liệu cho từng option của select
type Option = {
  value: string;
  label: string;
};

// Kiểu props cho Select dropdown
// Bao gồm danh sách options, giá trị hiện tại, và sự kiện onChange
type SelectProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  className?: string;
};

// Component select cơ bản cho form
const Select: React.FC<SelectProps> = ({ label, value, onChange, options, className = "" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
