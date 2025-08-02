// 📁 src/pages/host/CreateContract.tsx
// TRANG TẠO HỢP ĐỒNG MỚI
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { hostService } from "../../../services/hostService";

const CreateContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contract, setContract] = useState({
    roomId: location.state?.roomId || "",
    tenantId: location.state?.tenantId || "",
    contractDate: "",
    duration: 12,
    rentPrice: "",
    terms: "",
  });
  const [loading, setLoading] = useState(false);
  const [assignTenant, setAssignTenant] = useState(true); // Checkbox để gắn người thuê

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContract((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Tạo id duy nhất cho hợp đồng (có thể dùng Date.now hoặc uuid)
    const newId = `C${Date.now()}`;

    const dataToSubmit = {
      ...contract,
      id: newId, // Thêm dòng này
      contractId: newId, // Nếu muốn đồng bộ contractId với id
      duration: Number(contract.duration),
      rentPrice: Number(contract.rentPrice),
      contractDate: contract.contractDate,
    };

    try {
      if (assignTenant && location.state?.requestId) {
        await hostService.approveRentalRequestWithAssignment(
          location.state.requestId.toString(),
          dataToSubmit
        );
        alert("✅ Tạo hợp đồng và gắn người thuê thành công!");
      } else {
        await hostService.createContract(dataToSubmit);
        alert("✅ Tạo hợp đồng thành công!");
      }
      navigate("/host/contracts");
    } catch (error) {
      alert("❌ Tạo hợp đồng thất bại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          📝 Tạo Hợp Đồng Mới
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏠 ID Phòng *
              </label>
              <input
                name="roomId"
                value={contract.roomId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 ID Người thuê *
              </label>
              <input
                name="tenantId"
                value={contract.tenantId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Ngày ký hợp đồng *
              </label>
              <input
                name="contractDate"
                type="date"
                value={contract.contractDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🕒 Thời hạn hợp đồng (tháng) *
              </label>
              <input
                name="duration"
                type="number"
                value={contract.duration}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Giá thuê (VNĐ) *
              </label>
              <input
                name="rentPrice"
                type="number"
                value={contract.rentPrice}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Checkbox để gắn người thuê */}
          {location.state?.requestId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <input
                  id="assignTenant"
                  type="checkbox"
                  checked={assignTenant}
                  onChange={(e) => setAssignTenant(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="assignTenant" className="ml-2 block text-sm text-blue-800">
                  🏠 Gắn người thuê vào phòng ngay sau khi tạo hợp đồng
                </label>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Phòng sẽ được cập nhật trạng thái "Đã cho thuê" và người thuê sẽ được thêm vào danh sách quản lý
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📄 Điều khoản hợp đồng *
            </label>
            <textarea
              name="terms"
              value={contract.terms}
              onChange={handleChange}
              rows={6}
              required
              placeholder="Nhập các điều khoản và quy định của hợp đồng..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => navigate("/host/contracts")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "✅ Tạo Hợp Đồng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContract;