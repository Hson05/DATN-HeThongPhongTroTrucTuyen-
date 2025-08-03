// Chi tiết phòng
// ../client/src/pages/host/room/RoomDetail.tsx
import { X, MapPin, Users, Zap, DollarSign, FileText } from "lucide-react";
import { useState } from "react";
import InvoiceForm from "../../../components/InvoiceForm"; 
interface Tenant {
  fullName?: string;
  phone?: string;
  avatar?: string;
}

interface Room {
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
  tenant?: Tenant;
}

interface Props {
  room: Room;
  onClose: () => void;
}

export default function RoomDetail({ room, onClose }: Props) {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const displayImage =
    Array.isArray(room.images) && room.images.length > 0
      ? room.images[0]
      : "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1";

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

  const handleCreateInvoice = (invoiceData: any) => {
    console.log('Invoice created:', invoiceData);
    // Ở đây bạn có thể gọi API để lưu hóa đơn
    // await invoiceService.createInvoice(invoiceData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết phòng {room.roomId}</h2>
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
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Phòng {room.roomId}</h3>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Diện tích</p>
                    <p className="font-medium">{room.area} m²</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Số người tối đa</p>
                    <p className="font-medium">{room.maxPeople} người</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Giá thuê</p>
                  <p className="text-2xl font-bold text-green-600">{room.price.toLocaleString()}₫/tháng</p>
                </div>
              </div>

              {room.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mô tả</h4>
                  <p className="text-gray-600">{room.description}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Địa chỉ</h4>
                <p className="text-gray-600">{room.location || "Chưa cập nhật"}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tiện ích</h4>
                <div className="flex flex-wrap gap-2">
                  {room.utilities.map((u, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{u}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Tiền cọc</h4>
                  <p className="text-gray-600">{room.deposit || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Điện/nước</h4>
                  <p className="text-gray-600">{room.electricity ? `${room.electricity}đ/kW` : "Chưa cập nhật"}</p>
                </div>
              </div>

              {room.tenant && (
                <div className="bg-gray-50 rounded-lg p-4">
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

          {/* Nút tạo hóa đơn - chỉ hiện khi phòng đã có người thuê */}
          {room.tenant && room.status === "Đã cho thuê" && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowInvoiceForm(true)}
                className="flex items-center space-x-2 w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                <FileText size={20} />
                <span>Tạo hóa đơn thanh toán</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <InvoiceForm
          room={room}
          onClose={() => setShowInvoiceForm(false)}
          onSave={handleCreateInvoice}
        />
      )}
    </div>
  );
}