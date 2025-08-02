// 📁 src/pages/host/contract/CreateContract.tsx
// TRANG TẠO HỢP ĐỒNG MỚI
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { hostService } from "../../../services/hostService";

const CreateContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contract, setContract] = useState({
    roomId: location.state?.roomId || "",
    tenantId: location.state?.tenantName || "",
    contractDate: "",
    duration: 12,
    rentPrice: 0, // sửa thành number
    terms: "",
  });
  const [loading, setLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [autoAssignTenant, setAutoAssignTenant] = useState(true);

  useEffect(() => {
    // Lấy thông tin phòng để hiển thị và set giá thuê mặc định
    if (contract.roomId) {
      fetchRoomInfo();
    }
  }, [contract.roomId]);

  const fetchRoomInfo = async () => {
    try {
      const res = await hostService.getRoomById(contract.roomId);
      setRoomInfo(res.data);
      setContract(prev => ({
        ...prev,
        rentPrice: Number(res.data.price) || 0 // ép kiểu number
      }));
    } catch (error) {
      console.error("Error fetching room info:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContract((prev) => ({
      ...prev,
      [name]: name === "duration" || name === "rentPrice" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (autoAssignTenant && location.state?.requestId) {
        // Tạo hợp đồng và gắn người thuê từ yêu cầu
        await hostService.approveRentalRequestWithContract(
          location.state.requestId,
          contract
        );
        alert("✅ Tạo hợp đồng và gắn người thuê thành công!");
      } else {
        // Chỉ tạo hợp đồng
        const contractId = `C${Date.now()}`;
        await hostService.createContract({
          ...contract,
          contractId,
          tenantName: location.state?.tenantName || "",
          phone: location.state?.phone || "",
          email: location.state?.email || "",
          status: "active"
        });
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
        
        {/* Thông tin từ yêu cầu thuê */}
        {location.state && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Thông tin từ yêu cầu thuê:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Người thuê:</strong> {location.state.tenantName}</p>
              <p><strong>Số điện thoại:</strong> {location.state.phone}</p>
              <p><strong>Email:</strong> {location.state.email}</p>
              <p><strong>Phòng mong muốn:</strong> {location.state.roomId}</p>
            </div>
          </div>
        )}

        {/* Thông tin phòng */}
        {roomInfo && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Thông tin phòng:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Mã phòng:</strong> {roomInfo.roomId}</p>
              <p><strong>Diện tích:</strong> {roomInfo.area} m²</p>
              <p><strong>Giá thuê:</strong> {roomInfo.price?.toLocaleString()}₫/tháng</p>
              <p><strong>Số người tối đa:</strong> {roomInfo.maxPeople} người</p>
            </div>
          </div>
        )}
        
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
                👤 Tên người thuê *
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
              <select
                name="duration"
                value={contract.duration}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={6}>6 tháng</option>
                <option value={12}>12 tháng</option>
                <option value={24}>24 tháng</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Giá thuê (VNĐ/tháng) *
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
                  id="autoAssignTenant"
                  type="checkbox"
                  checked={autoAssignTenant}
                  onChange={(e) => setAutoAssignTenant(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoAssignTenant" className="ml-2 block text-sm text-blue-800">
                  🏠 Tự động gắn người thuê vào phòng sau khi tạo hợp đồng
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
              placeholder="Nhập các điều khoản và quy định của hợp đồng...&#10;Ví dụ:&#10;- Người thuê có trách nhiệm bảo vệ tài sản phòng trọ&#10;- Thanh toán tiền thuê trước ngày 5 hàng tháng&#10;- Không được nuôi thú cưng trong phòng&#10;- Giữ gìn vệ sinh chung và trật tự khu vực"
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