// src/components/common/Button.tsx
import React from "react";

// Định nghĩa kiểu dữ liệu cho Button
// Bao gồm loại button, biến thể giao diện, disabled, v.v.
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
};

// Component nút bấm tái sử dụng với các biến thể màu sắc
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) => {
  const base = "px-4 py-2 rounded text-white font-medium";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700",
    secondary: "bg-gray-500 hover:bg-gray-600",
    danger: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
