// src/components/common/Input.tsx
import React from "react";

// Kiểu dữ liệu cho input đơn giản, có hỗ trợ label và required
type InputProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
};

// Component input dùng cho form
const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  required = false,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;
