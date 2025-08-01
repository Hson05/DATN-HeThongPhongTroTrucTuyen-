// Chi tiết phòng
// ../client/src/pages/host/RoomDetail.tsx
import { X, MapPin, Users, Zap, DollarSign } from "lucide-react";

interface Props {
  room: any;
  onClose: () => void;
}

export default function RoomDetail({ room, onClose }: Props) {
  const displayCode = room.roomId || room.code || `P${room.id}`;
  const displayImage = room.image || "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1";
  const displayUtilities = room.utilities || "Chưa có thông tin";

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
            {/* Image */}
            <div>
              <img 
                src={displayImage} 
                alt="Phòng" 
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-sm" 
              />
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{displayCode}</h3>
                <p className="text-gray-600">{room.description || "Chưa có mô tả"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Giá thuê</p>
                    <p className="font-semibold text-green-600">
                      {room.price?.toLocaleString() || 0}đ/tháng
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Diện tích</p>
                    <p className="font-semibold">{room.area || 0} m²</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Số người</p>
                    <p className="font-semibold">Tối đa {room.maxPeople || 1} người</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-500">Điện</p>
                    <p className="font-semibold">{room.electricity || "3.500"}đ/kWh</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Địa chỉ</p>
                <p className="font-medium">{room.location || "Chưa có thông tin"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Tiền cọc</p>
                <p className="font-medium text-orange-600">{room.deposit || "Chưa có thông tin"}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Tiện nghi</h4>
                <div className="grid grid-cols-2 gap-2">
                  {displayUtilities.split(",").map((utility: string, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{utility.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {room.tenant && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Người thuê hiện tại</h4>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={room.tenant.avatar} 
                      alt={room.tenant.name}
                      className="w-12 h-12 rounded-full object-cover" 
                    />
                    <div>
                      <p className="font-medium text-gray-900">{room.tenant.name}</p>
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