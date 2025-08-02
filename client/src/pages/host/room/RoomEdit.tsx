// Sửa thông tin phòng
// ../client/src/pages/host/UpdateRoom.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hostService } from "../../../services/hostService";

export default function UpdateRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomId: "",
    roomTitle: "",
    area: 0,
    price: 0,
    utilities: [],
    maxPeople: 1,
    images: [""],
    description: "",
    location: "",
    deposit: "",
    electricity: "",
    roomType: "single",
    status: "available",
    terms: "",
    hostId: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setInitialLoading(true);
      hostService.getRoomById(id)
        .then((res) => {
          const room = res.data;
          setFormData({
            roomId: room.roomId || "",
            roomTitle: room.roomTitle || "",
            area: room.area || 0,
            price: room.price || 0,
            utilities: Array.isArray(room.utilities) ? room.utilities : (room.utilities ? room.utilities.split(",").map((u: string) => u.trim()) : []),
            maxPeople: room.maxPeople || 1,
            images: Array.isArray(room.images) ? room.images : (room.image ? [room.image] : [""]),
            description: room.description || "",
            location: room.location || "",
            deposit: room.deposit || "",
            electricity: room.electricity || "",
            roomType: room.roomType || "single",
            status: room.status || "available",
            terms: room.terms || "",
            hostId: room.hostId || "",
          });
        })
        .catch(() => {
          alert("❌ Không tìm thấy thông tin phòng.");
          navigate("/host/room-list");
        })
        .finally(() => setInitialLoading(false));
    }
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "area" || name === "price" || name === "maxPeople"
          ? Number(value)
          : name === "utilities"
          ? value.split(",").map((u) => u.trim())
          : name === "images"
          ? [value]
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);

    // Chuẩn hóa dữ liệu trước khi gửi
    const dataToSubmit = {
      ...formData,
      images: Array.isArray(formData.images) ? formData.images : [formData.images],
      utilities: Array.isArray(formData.utilities) ? formData.utilities : [],
    };

    try {
      await hostService.updateRoom(id, dataToSubmit);
      alert("✅ Cập nhật phòng thành công!");
      navigate("/host/room-list");
    } catch (error) {
      alert("❌ Cập nhật phòng thất bại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🛠 Cập nhật thông tin phòng
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề phòng *
              </label>
              <input
                type="text"
                name="roomTitle"
                value={formData.roomTitle}
                onChange={handleChange}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại phòng *
              </label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="single">Đơn</option>
                <option value="shared">Chung</option>
                <option value="apartment">Căn hộ</option>
              </select>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiện ích (cách nhau bởi dấu phẩy)
            </label>
            <input
              type="text"
              name="utilities"
              value={Array.isArray(formData.utilities) ? formData.utilities.join(", ") : ""}
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
              name="images"
              value={formData.images[0]}
              onChange={handleChange}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điều khoản thuê
            </label>
            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              rows={3}
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
              {loading ? "Đang cập nhật..." : "💾 Cập nhật phòng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}