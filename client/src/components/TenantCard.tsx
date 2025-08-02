// src/components/TenantCard.tsx
// Thẻ hiển thị thông tin người thuê
import { User, Phone, Home, Calendar, AlertCircle } from "lucide-react";

export interface TenantCardProps {
  tenant: {
    userId: string;
    fullName: string;
    phone: string;
    email: string;
    avatar: string;
    roomCode: string;
    roomId: string;
    startDate: string;
    endDate: string;
    contractId?: string;
    monthlyRent: number;
  };
  onViewDetail: () => void;
  onTerminateContract: () => void;
  onEditTenant: () => void;
}

const TenantCard = ({ tenant, onViewDetail, onTerminateContract, onEditTenant }: TenantCardProps) => {
  const getRemainingDays = () => {
    const endDate = new Date(tenant.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const remainingDays = getRemainingDays();
  const isExpiringSoon = remainingDays <= 30 && remainingDays > 0;
  const isExpired = remainingDays <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={tenant.avatar}
          alt={tenant.fullName}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{tenant.fullName}</h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Phone className="w-4 h-4 mr-1" />
                <span>{tenant.phone}</span>
              </div>
            </div>
            {(isExpiringSoon || isExpired) && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                isExpired ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                <AlertCircle className="w-3 h-3" />
                <span>{isExpired ? 'Hết hạn' : 'Sắp hết hạn'}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Phòng</p>
                <p className="font-medium text-gray-900">{tenant.roomCode}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Bắt đầu thuê</p>
                <p className="font-medium text-gray-900">{new Date(tenant.startDate).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Thời gian thuê còn lại</span>
              <span className={`text-sm font-medium ${
                isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {isExpired ? 'Đã hết hạn' : `${remainingDays} ngày`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  isExpired ? 'bg-red-500' : isExpiringSoon ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (remainingDays / 365) * 100))}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-lg font-bold text-blue-600">
              {tenant.monthlyRent.toLocaleString()}₫/tháng
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onViewDetail}
              className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
            >
              Chi tiết
            </button>
            <button
              onClick={onEditTenant}
              className="flex-1 bg-yellow-50 text-yellow-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-100 transition"
            >
              Sửa
            </button>
            <button
              onClick={onTerminateContract}
              className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition"
            >
              Trả phòng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantCard;