// ../client/src/pages/room/host/RoomList.tsx
// Danh sách phòng trọ
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hostService } from "../../../services/hostService";
import RoomCard from "../../../components/RoomCard";
import RoomDetail from "./RoomDetail";
import { Plus, Search, Filter } from "lucide-react";

interface Room {
  id?: number;
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
    userId: string;
    fullName: string;
    phone: string;
    avatar: string;
  };
}

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const [roomsRes, statusRes] = await Promise.all([
        hostService.getRooms(),
        hostService.getRoomStatus()
      ]);
      
      const roomsWithStatus = roomsRes.data.map((room: any) => {
        const status = statusRes.data.find((s: any) => s.roomId === room.roomId);
        return {
          ...room,
          utilities: Array.isArray(room.utilities)
            ? room.utilities
            : room.utilities
            ? room.utilities.split(",").map((u: string) => u.trim())
            : [],
          images: Array.isArray(room.images)
            ? room.images
            : room.images
            ? [room.images]
            : [],
          status: status ? status.status : (room.tenant ? "Đã cho thuê" : "Trống"),
        };
      });
      
      setRooms(roomsWithStatus);
      setFilteredRooms(roomsWithStatus);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]);
      setFilteredRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    let filtered = rooms;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(room => {
        const roomTitle = `Phòng ${room.roomId}`;
        const utilities = Array.isArray(room.utilities) ? room.utilities.join(", ") : "";
        return roomTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
               utilities.toLowerCase().includes(searchTerm.toLowerCase()) ||
               room.roomId.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(room => room.status === statusFilter);
    }

    setFilteredRooms(filtered);
  }, [searchTerm, statusFilter, rooms]);

  const handleDelete = async (roomId: string) => {
    const confirm = window.confirm("❗Bạn có chắc chắn muốn xóa phòng này?");
    if (!confirm) return;

    try {
      await hostService.deleteRoom(roomId);
      fetchRooms();
      alert("✅ Đã xóa phòng thành công!");
    } catch (err: any) {
      alert(`❌ Lỗi khi xóa phòng: ${err.message || 'Lỗi không xác định'}`);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải danh sách phòng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh sách phòng trọ</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả phòng trọ của bạn</p>
        </div>
        <button
          onClick={() => navigate("/host/create-room")}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          <span>Thêm phòng mới</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã phòng hoặc tiện ích..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Trống">Còn trống</option>
              <option value="Đã cho thuê">Đã cho thuê</option>
              <option value="Đang sửa chữa">Đang sửa chữa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredRooms.length} trong tổng số {rooms.length} phòng
        </p>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== "all" ? "Không tìm thấy phòng nào" : "Chưa có phòng nào"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== "all" 
              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              : "Hãy tạo phòng đầu tiên của bạn"
            }
          </p>
          {!searchTerm && statusFilter === "all" && (
            <button
              onClick={() => navigate("/host/create-room")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Tạo phòng đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, idx) => (
            <RoomCard
              key={room.roomId || `room-${idx}`}
              room={room}
              onViewDetail={() => setSelectedRoom(room)}
              onEdit={() => navigate(`/host/update-room/${room.roomId}`)}
              onDelete={() => handleDelete(room.roomId)}
            />
          ))}
        </div>
      )}

      {selectedRoom && (
        <RoomDetail 
          room={selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
        />
      )}
    </div>
  );
}