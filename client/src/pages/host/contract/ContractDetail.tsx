// 📁 src/pages/host/ContractDetail.tsx
// Trang xem chi tiết hợp đồng thuê phòng
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hostService } from "../../../services/hostService";
import { FileText, Download, ArrowLeft } from "lucide-react";

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      hostService
        .getContractById(id)
        .then((res) => setContract(res.data))
        .catch(() => alert("❌ Không tìm thấy hợp đồng!"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải chi tiết hợp đồng...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy hợp đồng
          </h3>
          <p className="text-gray-500 mb-6">
            Hợp đồng có thể đã bị xóa hoặc không tồn tại
          </p>
          <button
            onClick={() => navigate("/host/contracts")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/host/contracts")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Download size={16} />
            <span>In hợp đồng</span>
          </button>
        </div>
      </div>

      {/* Contract Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 print:shadow-none print:border-none">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            HỢP ĐỒNG THUÊ PHÒNG TRỌ
          </h1>
          <p className="text-gray-600">Số: #{contract.id}</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                Thông tin người thuê
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">ID Người thuê:</span> {contract.tenantId}
                </p>
                {/* Nếu muốn hiển thị họ tên/sdt, cần fetch thêm từ bảng users */}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                Thông tin phòng
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Mã phòng:</span> {contract.roomId}
                </p>
                <p>
                  <span className="font-medium">Giá thuê:</span> {contract.rentPrice?.toLocaleString()}₫
                </p>
                <p>
                  <span className="font-medium">Thời hạn:</span> {contract.duration} tháng
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p>
                <span className="font-medium">Ngày ký hợp đồng:</span> {contract.contractDate}
              </p>
            </div>
            {/* Nếu muốn hiển thị ngày kết thúc, tính bằng contractDate + duration tháng */}
            <div>
              <p>
                <span className="font-medium">Ngày kết thúc:</span> {
                  contract.contractDate
                    ? new Date(new Date(contract.contractDate).setMonth(new Date(contract.contractDate).getMonth() + Number(contract.duration)))
                        .toLocaleDateString('vi-VN')
                    : ""
                }
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">
              Điều khoản hợp đồng
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {contract.terms}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t">
            <div className="text-center">
              <p className="font-semibold mb-16">BÊN CHO THUÊ</p>
              <div className="border-t border-gray-400 pt-2">
                <p className="text-sm text-gray-600">(Ký và ghi rõ họ tên)</p>
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold mb-16">BÊN THUÊ</p>
              <div className="border-t border-gray-400 pt-2">
                <p className="text-sm text-gray-600">(Ký và ghi rõ họ tên)</p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-8">
            <p>Hợp đồng được tạo ngày: {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
