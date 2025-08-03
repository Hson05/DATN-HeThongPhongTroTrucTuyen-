import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, FileText, Save } from 'lucide-react';
import { hostService } from '../services/hostService';

interface Tenant {
  fullName?: string;
  phone?: string;
  avatar?: string;
}

interface Room {
  roomId: string;
  price: number;
  tenant?: Tenant;
}

interface Props {
  room: Room;
  onClose: () => void;
  onSave?: (invoiceData: any) => void;
}

export default function InvoiceForm({ room, onClose, onSave }: Props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomId: room.roomId,
    tenantName: room.tenant?.fullName || '',
    roomPrice: room.price,
    electricityAmount: 0,
    electricityRate: 3500,
    waterAmount: 0,
    waterRate: 25000,
    otherFees: 0,
    otherFeesDescription: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    dueDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Amount') || name.includes('Rate') || name.includes('Fees') || name === 'roomPrice' || name === 'month' || name === 'year'
        ? Number(value) || 0
        : value
    }));
  };

  const calculateTotal = () => {
    const electricityTotal = formData.electricityAmount * formData.electricityRate;
    const waterTotal = formData.waterAmount * formData.waterRate;
    return formData.roomPrice + electricityTotal + waterTotal + formData.otherFees;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceData = {
      ...formData,
      electricityTotal: formData.electricityAmount * formData.electricityRate,
      waterTotal: formData.waterAmount * formData.waterRate,
      totalAmount: calculateTotal(),
      createdDate: new Date().toISOString(),
      status: 'unpaid' as const,
    };
    
    try {
      await hostService.createInvoice(invoiceData);
      if (onSave) {
        onSave(invoiceData);
      }
      alert('✅ Tạo hóa đơn thành công!');
      // Chuyển hướng sang trang danh sách hóa đơn
      navigate('/host/invoices');
    } catch (error) {
      alert('❌ Tạo hóa đơn thất bại!');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tạo hóa đơn - Phòng {room.roomId}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số phòng
                </label>
                <input
                  type="text"
                  value={formData.roomId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên người thuê
                </label>
                <input
                  type="text"
                  name="tenantName"
                  value={formData.tenantName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tháng
                </label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Năm
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="2020"
                  max="2030"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Chi phí */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Chi phí</h3>
            
            {/* Tiền phòng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiền phòng (VNĐ)
                </label>
                <input
                  type="number"
                  name="roomPrice"
                  value={formData.roomPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  Tiền phòng cố định hàng tháng
                </div>
              </div>
            </div>

            {/* Tiền điện */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện (kWh)
                </label>
                <input
                  type="number"
                  name="electricityAmount"
                  value={formData.electricityAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn giá (VNĐ/kWh)
                </label>
                <input
                  type="number"
                  name="electricityRate"
                  value={formData.electricityRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thành tiền
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                  {(formData.electricityAmount * formData.electricityRate).toLocaleString()}₫
                </div>
              </div>
            </div>

            {/* Tiền nước */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số nước (m³)
                </label>
                <input
                  type="number"
                  name="waterAmount"
                  value={formData.waterAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn giá (VNĐ/m³)
                </label>
                <input
                  type="number"
                  name="waterRate"
                  value={formData.waterRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thành tiền
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                  {(formData.waterAmount * formData.waterRate).toLocaleString()}₫
                </div>
              </div>
            </div>

            {/* Phí khác */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phí khác (VNĐ)
                </label>
                <input
                  type="number"
                  name="otherFees"
                  value={formData.otherFees}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả phí khác
                </label>
                <input
                  type="text"
                  name="otherFeesDescription"
                  value={formData.otherFeesDescription}
                  onChange={handleChange}
                  placeholder="VD: Phí vệ sinh, internet..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Hạn thanh toán */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hạn thanh toán
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Tổng cộng */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
              <span className="text-2xl font-bold text-blue-600">
                {calculateTotal().toLocaleString()}₫
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Save size={16} />
              <span>Tạo hóa đơn</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}