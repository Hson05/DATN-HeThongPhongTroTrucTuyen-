// Tạo phòng mới
// ../client/src/pages/host/CreateRoom.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hostService } from "../../../services/hostService";

export default function CreateRoom() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomId: "",
    area: 0,
    price: 0,
    utilities: "",
    maxPeople: 1,
    image: "",
    description: "",
    location: "",
    deposit: "",
    electricity: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "area" || name === "price" || name === "maxPeople" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await hostService.createRoom(formData);
      alert("✅ Tạo phòng thành công!");
      navigate("/host/room-list");
    } catch (error) {
      alert("❌ Tạo phòng thất bại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🏠 Thêm phòng trọ mới
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã phòng *
              </label>
              <input 
                type="text" 
                name="roomId" 
                value={formData.roomId} 
                onChange={handleChange}
                placeholder="VD: P101, P102..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá phòng (VNĐ) *
              </label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange}
                placeholder="3000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diện tích (m²) *
              </label>
              <input 
                type="number" 
                name="area" 
                value={formData.area} 
                onChange={handleChange}
                placeholder="25"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số người tối đa
              </label>
              <input 
                type="number" 
                name="maxPeople" 
                value={formData.maxPeople} 
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiền cọc
              </label>
              <input 
                type="text" 
                name="deposit" 
                value={formData.deposit} 
                onChange={handleChange}
                placeholder="1 tháng tiền phòng"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá điện/nước
              </label>
              <input 
                type="text" 
                name="electricity" 
                value={formData.electricity} 
                onChange={handleChange}
                placeholder="3.500đ/kWh"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiện ích
            </label>
            <input 
              type="text" 
              name="utilities" 
              value={formData.utilities} 
              onChange={handleChange}
              placeholder="Máy lạnh, Wifi, Máy giặt..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh phòng (URL)
            </label>
            <input 
              type="text" 
              name="image" 
              value={formData.image} 
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ phòng
            </label>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange}
              placeholder="Lầu 1, Số 10 Nguyễn Văn Bảo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết
            </label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              rows={4}
              placeholder="Mô tả về phòng, môi trường xung quanh..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => navigate("/host/room-list")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "➕ Thêm phòng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}