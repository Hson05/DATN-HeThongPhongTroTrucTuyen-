// Chi tiết phòng
// ../client/src/pages/host/RoomDetail.tsx
import { X, MapPin, Users, Zap, DollarSign } from "lucide-react";

interface Tenant {
  fullName?: string;
  phone?: string;
  avatar?: string;
}

interface Room {
  roomId: string;
  roomTitle: string;
  area: number;
  price: number;
  utilities: string[];
  maxPeople: number;
  images: string[];
  description?: string;
  location?: string;
  deposit?: string;
  electricity?: string;
  status: string;
  roomType?: string;
  terms?: string;
  hostId?: string;
  tenant?: Tenant;
}

interface Props {
  room: Room;
  onClose: () => void;
}

export default function RoomDetail({ room, onClose }: Props) {
  const displayImage =
    Array.isArray(room.images) && room.images.length > 0
      ? room.images[0]
      : "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết phòng</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <img
                src={displayImage}
                alt="Phòng"
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-sm"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.roomTitle}</h3>
              <p className="text-gray-600">{room.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {room.utilities.map((u, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{u}</span>
                ))}
              </div>
              <p className="font-semibold text-green-600">{room.price.toLocaleString()}₫/tháng</p>
              <p className="text-gray-600">Diện tích: {room.area} m²</p>
              <p className="text-gray-600">Số người tối đa: {room.maxPeople}</p>
              <p className="text-gray-600">Địa chỉ: {room.location}</p>
              <p className="text-gray-600">Tiền cọc: {room.deposit}</p>
              <p className="text-gray-600">Điện/nước: {room.electricity}</p>
              {room.tenant && (
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Người thuê hiện tại</h4>
                  <div className="flex items-center space-x-3">
                    <img
                      src={room.tenant.avatar}
                      alt={room.tenant.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{room.tenant.fullName}</p>
                      <p className="text-sm text-gray-500">{room.tenant.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}