// src/components/Modal.tsx
// Component Modal tái sử dụng
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}

const Modal = ({ title, children, onClose, maxWidth = "max-w-2xl" }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className={`bg-white w-full ${maxWidth} rounded-xl shadow-xl max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;