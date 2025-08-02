// src/components/RoomCard.tsx
// Thẻ hiển thị thông tin phòng trọ
import { MapPin, Users, Zap } from "lucide-react";

interface RoomCardProps {
  room: {
    roomId: string;
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
    tenant?: {
      fullName?: string;
      phone?: string;
      avatar?: string;
    };
  };
  onViewDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const RoomCard = ({ room, onViewDetail, onEdit, onDelete }: RoomCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã cho thuê":
        return "bg-green-100 text-green-800";
      case "Trống":
      case "Còn trống":
        return "bg-yellow-100 text-yellow-800";
      case "Đang sửa chữa":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <img
        src={
          room.images && room.images.length > 0
            ? room.images[0]
            : "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1"
        }
        alt={`Phòng ${room.roomId}`}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h3 className="font-bold text-lg mb-2">Phòng {room.roomId}</h3>
      <p className="text-gray-600 mb-1">
        <MapPin className="w-4 h-4 inline mr-1" />
        {room.location || "Địa chỉ chưa cập nhật"}
      </p>
      <p className="text-gray-500 text-sm mb-2">{room.description}</p>
      <div className="flex items-center text-gray-500 text-sm mb-2">
        <span>{room.area}m²</span>
        <span className="mx-2">•</span>
        <Users className="w-4 h-4 inline mr-1" />
        <span>{room.maxPeople} người</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {room.utilities.map((u, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
          >
            {u}
          </span>
        ))}
      </div>
      
      <div className="mb-3">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
          {room.status}
        </span>
      </div>

      {room.tenant && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2">
            <img
              src={room.tenant.avatar}
              alt={room.tenant.fullName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-sm">{room.tenant.fullName}</p>
              <p className="text-xs text-gray-500">{room.tenant.phone}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-auto">
        <span className="font-semibold text-green-600">
          {room.price.toLocaleString()}₫/tháng
        </span>
        <div className="flex gap-2">
          <button
            onClick={onViewDetail}
            className="text-blue-600 hover:underline"
          >
            Chi tiết
          </button>
          <button onClick={onEdit} className="text-yellow-600 hover:underline">
            Sửa
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:underline"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;