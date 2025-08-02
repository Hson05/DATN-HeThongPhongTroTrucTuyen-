// src/pages/host/Dashboard.tsx
// Trang tổng quan của chủ nhà
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hostService } from "../../services/hostService";
import StatCard from "../../components/StatCard";
import RoomCard from "../../components/RoomCard";
import RentalRequestCard from "../../components/RentalRequestCard";
import TenantCard from "../../components/TenantCard";
import RoomDetail from "./room/RoomDetail";
import TenantDetail from "./tenant/TenantDetail";
import { Home, CheckCircle, Users, DollarSign, Plus, Eye, UserCheck } from "lucide-react";

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
  tenant?: {
    userId: string;
    fullName: string;
    phone: string;
    avatar: string;
  };
}

interface RentalRequest {
  requestId: string; // Thêm dòng này
  id: string;
  tenantName: string;
  phone: string;
  email: string;
  desiredRoomId: string;
  status: string;
  message: string;
  submittedAt: string;
  avatar: string;
}

interface Tenant {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  avatar: string;
  roomCode: string;
  roomId: string;
  startDate: string;
  endDate: string;
  contractId?: string;
  monthlyRent: number;
}

interface Statistics {
  totalRooms: number;
  availableRooms: number;
  rentedRooms: number;
  totalRevenue: number;
  totalTenants: number;
}

const Dashboard = () => {
  const [statistics, setStatistics] = useState<Statistics>({
    totalRooms: 0,
    availableRooms: 0,
    rentedRooms: 0,
    totalRevenue: 0,
    totalTenants: 0
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, roomsRes, requestsRes, tenantsRes] = await Promise.all([
        hostService.getStatistics(),
        hostService.getRooms(),
        hostService.getRentalRequests(),
        hostService.getTenants()
      ]);

      setStatistics(statsRes.data);
      setRooms(
        roomsRes.data.map((room: any) => ({
          roomId: room.roomId,
          roomTitle: room.roomTitle || room.roomId || "",
          area: room.area,
          price: room.price,
          utilities: Array.isArray(room.utilities)
            ? room.utilities
            : room.utilities
            ? room.utilities.split(",").map((u: string) => u.trim())
            : [],
          maxPeople: room.maxPeople,
          images: Array.isArray(room.images)
            ? room.images
            : room.image
            ? [room.image]
            : [],
          description: room.description,
          location: room.location,
          deposit: room.deposit,
          electricity: room.electricity,
          status: room.tenant ? "Đã cho thuê" : "Còn trống",
          roomType: room.roomType,
          tenant: room.tenant
            ? {
                userId: room.tenant.userId,
                fullName: room.tenant.fullName,
                phone: room.tenant.phone,
                avatar: room.tenant.avatar,
              }
            : undefined,
        }))
      );
      setRentalRequests(
        requestsRes.data.map((req: any) => ({
          requestId: req.requestId?.toString() || req.id?.toString() || "", // Thêm dòng này
          id: req.id?.toString() || "",
          tenantName: req.tenantName,
          phone: req.phone,
          email: req.email,
          desiredRoomId: req.desiredRoomId,
          status: req.status,
          message: req.message,
          submittedAt:
            new Date().toLocaleDateString("vi-VN") +
            " - " +
            new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          avatar: "https://i.pravatar.cc/100?img=" + req.id,
        }))
      );
      setTenants(
        tenantsRes.data.map((tenant: any) => ({
          userId: tenant.userId,
          fullName: tenant.fullName,
          phone: tenant.phone,
          email: tenant.email,
          avatar: tenant.avatar,
          roomCode: tenant.roomCode,
          roomId: tenant.roomId,
          startDate: tenant.startDate,
          endDate: tenant.endDate,
          contractId: tenant.contractId,
          monthlyRent: tenant.monthlyRent,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteRoom = async (roomId: string) => {
    const confirm = window.confirm("❗Bạn có chắc chắn muốn xóa phòng này?");
    if (!confirm) return;

    try {
      await hostService.deleteRoom(roomId);
      setRooms(rooms.filter((room) => room.roomId !== roomId));
    } catch (err) {
      alert("❌ Lỗi khi xóa phòng!");
      console.error(err);
    }
  };

  const handleApproveRequest = async (request: RentalRequest) => {
    const confirm = window.confirm("Bạn có chắc muốn duyệt và tạo hợp đồng?");
    if (!confirm) return;

    try {
      navigate("/host/create-contract", {
        state: {
          tenantName: request.tenantName,
          phone: request.phone,
          email: request.email,
          roomId: request.desiredRoomId,
          requestId: request.id
        },
      });
    } catch (error) {
      alert("Lỗi khi duyệt yêu cầu!");
    }
  };

  const handleRejectRequest = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc muốn từ chối?");
    if (!confirm) return;

    try {
      await hostService.rejectRentalRequest(id);
      setRentalRequests(rentalRequests.filter(req => req.id !== id));
      alert("Đã từ chối yêu cầu.");
    } catch (error) {
      alert("Lỗi khi từ chối yêu cầu!");
    }
  };

  const handleTerminateTenant = async (tenant: Tenant) => {
    const confirm = window.confirm(
      `Bạn có chắc muốn chấm dứt hợp đồng với ${tenant.fullName}?`
    );
    if (!confirm) return;

    try {
      if (!tenant.contractId) {
        alert("❌ Không tìm thấy mã hợp đồng để chấm dứt!");
        return;
      }

      await hostService.terminateContract(tenant.contractId);
      alert("✅ Đã chấm dứt hợp đồng thành công!");
      fetchData(); // Refresh data
    } catch (error: any) {
      alert(
        `❌ Có lỗi xảy ra: ${error.message || "Không thể chấm dứt hợp đồng"}`
      );
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Chào Nguyễn Thị Mai!
          </h1>
          <p className="text-gray-600">
            Quản lý phòng trọ và theo dõi doanh thu của bạn
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Tổng phòng"
            value={statistics.totalRooms}
            icon={Home}
            iconColor="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            title="Đã cho thuê"
            value={statistics.rentedRooms}
            icon={CheckCircle}
            iconColor="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            title="Còn trống"
            value={statistics.availableRooms}
            icon={Users}
            iconColor="text-yellow-600"
            bgColor="bg-yellow-100"
          />
          <StatCard
            title="Người thuê"
            value={statistics.totalTenants}
            icon={UserCheck}
            iconColor="text-purple-600"
            bgColor="bg-purple-100"
          />
          <StatCard
            title="Doanh thu/tháng"
            value={`${statistics.totalRevenue.toLocaleString()}đ`}
            icon={DollarSign}
            iconColor="text-emerald-600"
            bgColor="bg-emerald-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rooms Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Phòng trọ
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate("/host/room-list")}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Eye size={16} />
                  <span>Tất cả</span>
                </button>
                <button
                  onClick={() => navigate("/host/create-room")}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  <Plus size={16} />
                  <span>Thêm</span>
                </button>
              </div>
            </div>

            {rooms.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Home className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-3">Bạn chưa có phòng nào</p>
                <button
                  onClick={() => navigate("/host/create-room")}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Tạo phòng đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {rooms.slice(0, 2).map((room) => (
                  <RoomCard
                    key={room.roomId}
                    room={room}
                    onViewDetail={() => setSelectedRoom(room)}
                    onEdit={() => navigate(`/host/update-room/${room.roomId}`)}
                    onDelete={() => handleDeleteRoom(room.roomId)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tenants Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Người thuê
              </h2>
              <button
                onClick={() => navigate("/host/tenant-list")}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Eye size={16} />
                <span>Tất cả</span>
              </button>
            </div>

            {tenants.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <UserCheck className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Chưa có người thuê nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tenants.slice(0, 2).map((tenant) => (
                  <TenantCard
                    key={tenant.userId}
                    tenant={tenant}
                    onViewDetail={() => setSelectedTenant(tenant)}
                    onTerminateContract={() => handleTerminateTenant(tenant)}
                    onEditTenant={() => navigate(`/host/tenant-edit/${tenant.userId}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Rental Requests Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Yêu cầu thuê
              </h2>
              <button
                onClick={() => navigate("/host/rental-request")}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Eye size={16} />
                <span>Tất cả</span>
              </button>
            </div>

            {rentalRequests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Không có yêu cầu mới</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rentalRequests.slice(0, 2).map((request) => (
                <RentalRequestCard
  key={request.id}
  request={request}
  onApprove={() => handleApproveRequest(request)}
  onReject={() => handleRejectRequest(request.id)}
/>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedRoom && (
        <RoomDetail 
          room={selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
        />
      )}

      {selectedTenant && (
        <TenantDetail 
          tenant={selectedTenant} 
          onClose={() => setSelectedTenant(null)} 
          onUpdated={fetchData}
        />
      )}
    </div>
  );
};

export default Dashboard;