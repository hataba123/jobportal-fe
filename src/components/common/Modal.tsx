// src/components/common/Modal.tsx
import React from "react";
import { createPortal } from "react-dom";

// Props cho Modal, bao gồm trạng thái hiển thị, tiêu đề và nội dung
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

// Component Modal overlay sử dụng React Portal để hiển thị ngoài DOM gốc
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <div>{children}</div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
