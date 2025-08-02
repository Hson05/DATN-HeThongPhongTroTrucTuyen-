// src/pages/host/tenant/TenantDetail.tsx
// Trang chi tiết người thuê
import { X, User, Phone, Mail, Home, Calendar, FileText, DollarSign } from "lucide-react";
import { hostService } from "../../../services/hostService";

interface Props {
  tenant: any;
  onClose: () => void;
  onUpdated?: () => void;
}

const TenantDetail = ({ tenant, onClose, onUpdated }: Props) => {
  const getRemainingDays = () => {
    const endDate = new Date(tenant.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleExtendContract = async (months: number) => {
    if (!tenant.userId) {
      alert("❌ Không tìm thấy thông tin người thuê.");
      return;
    }

    const confirm = window.confirm(
      `Bạn có chắc muốn gia hạn hợp đồng thêm ${months} tháng cho ${tenant.fullName}?`
    );
    if (!confirm) return;

    try {
      const result = await hostService.extendContract(tenant.userId, months);
      alert(`✅ ${result.message}\nNgày kết thúc mới: ${new Date(result.newEndDate).toLocaleDateString('vi-VN')}`);
      if (onUpdated) onUpdated();
      onClose();
    } catch (error: any) {
      console.error("❌ Lỗi khi gia hạn hợp đồng:", error);
      alert(`❌ Gia hạn hợp đồng thất bại: ${error.message || 'Lỗi không xác định'}`);
    }
  };

  const remainingDays = getRemainingDays();
  const isExpired = remainingDays <= 0;
  const isExpiringSoon = remainingDays <= 30 && remainingDays > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết người thuê</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar & Basic Info */}
            <div className="lg:col-span-1">
              <div className="text-center mb-6">
                <img 
                  src={tenant.avatar} 
                  alt={tenant.fullName}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-gray-200" 
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tenant.fullName}</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isExpired ? 'bg-red-100 text-red-800' : isExpiringSoon ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {isExpired ? 'Hết hạn hợp đồng' : isExpiringSoon ? 'Sắp hết hạn' : 'Đang thuê'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium text-gray-900">{tenant.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{tenant.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg border-b pb-2">
                    Thông tin phòng
                  </h4>
                  
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Home className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phòng đang thuê</p>
                      <p className="font-bold text-blue-600 text-lg">{tenant.roomCode}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Tiền thuê hàng tháng</p>
                      <p className="font-bold text-green-600 text-lg">
                        {tenant.monthlyRent?.toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg border-b pb-2">
                    Thông tin hợp đồng
                  </h4>
                  
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                      <p className="font-medium text-gray-900">
                        {tenant.startDate ? new Date(tenant.startDate).toLocaleDateString('vi-VN') : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày kết thúc</p>
                      <p className="font-medium text-gray-900">
                        {tenant.endDate ? new Date(tenant.endDate).toLocaleDateString('vi-VN') : ""}
                      </p>
                    </div>
                  </div>

                  {tenant.contractId && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <FileText className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Mã hợp đồng</p>
                        <p className="font-medium text-gray-900">#{tenant.contractId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contract Timeline */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 text-lg mb-4">Thời gian thuê</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Tiến độ hợp đồng</span>
                    <span className={`text-sm font-medium ${
                      isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {isExpired ? 'Đã hết hạn' : `Còn ${remainingDays} ngày`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        isExpired ? 'bg-red-500' : isExpiringSoon ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.max(0, Math.min(100, ((365 - remainingDays) / 365) * 100))}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Gia hạn hợp đồng</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleExtendContract(6)}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Gia hạn 6 tháng
                  </button>
                  <button
                    onClick={() => handleExtendContract(12)}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Gia hạn 12 tháng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetail;