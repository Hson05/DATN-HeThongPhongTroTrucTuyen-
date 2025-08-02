// src/pages/host/tenant/TenantList.tsx
// Trang danh sách người thuê hiện tại
import { useEffect, useState } from "react";
import { hostService } from "../../../services/hostService";
import { useNavigate } from "react-router-dom";
import TenantCard from "../../../components/TenantCard";
import TenantDetail from "./TenantDetail";
import Modal from "../../../components/Modal";
import { Users, Search, Filter, UserX, AlertTriangle } from "lucide-react";

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

const TenantList = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [terminatingTenant, setTerminatingTenant] = useState<Tenant | null>(null);
  const navigate = useNavigate();

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await hostService.getTenants();
      setTenants(res.data);
      setFilteredTenants(res.data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  useEffect(() => {
    let filtered = tenants;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tenant =>
        tenant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone.includes(searchTerm) ||
        tenant.roomCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      const today = new Date();
      filtered = filtered.filter(tenant => {
        const endDate = new Date(tenant.endDate);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (statusFilter) {
          case "active":
            return diffDays > 30;
          case "expiring":
            return diffDays <= 30 && diffDays > 0;
          case "expired":
            return diffDays <= 0;
          default:
            return true;
        }
      });
    }

    setFilteredTenants(filtered);
  }, [searchTerm, statusFilter, tenants]);

  // ✅ SỬA LẠI: Sử dụng contractId thay vì tenant.id
  const handleTerminateContract = async (tenant: Tenant) => {
    try {
      if (!tenant.contractId) {
        alert("❌ Không tìm thấy mã hợp đồng để chấm dứt!");
        return;
      }

      await hostService.terminateContract(tenant.contractId);
      alert("✅ Đã chấm dứt hợp đồng và trả phòng thành công!");
      setTerminatingTenant(null);
      fetchTenants(); // Refresh data
    } catch (error: any) {
      alert(`❌ Có lỗi xảy ra: ${error.message || 'Không thể chấm dứt hợp đồng'}`);
      console.error(error);
    }
  };

  const getStatusStats = () => {
    const today = new Date();
    const stats = {
      total: tenants.length,
      active: 0,
      expiring: 0,
      expired: 0
    };

    tenants.forEach(tenant => {
      const endDate = new Date(tenant.endDate);
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 30) {
        stats.active++;
      } else if (diffDays <= 30 && diffDays > 0) {
        stats.expiring++;
      } else {
        stats.expired++;
      }
    });

    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải danh sách người thuê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Danh sách người thuê</h1>
        <p className="text-gray-600">Quản lý tất cả người thuê hiện tại</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng số người thuê</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang thuê</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sắp hết hạn</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.expiring}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hết hạn</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
            <UserX className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, số điện thoại hoặc phòng..."
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
              <option value="active">Đang thuê</option>
              <option value="expiring">Sắp hết hạn</option>
              <option value="expired">Đã hết hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Hiển thị {filteredTenants.length} trong tổng số {tenants.length} người thuê
        </p>
      </div>

      {/* Tenants Grid */}
      {filteredTenants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== "all" ? "Không tìm thấy người thuê nào" : "Chưa có người thuê nào"}
          </h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== "all" 
              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              : "Người thuê sẽ xuất hiện ở đây sau khi được gắn vào phòng"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.userId}
              tenant={tenant}
              onViewDetail={() => setSelectedTenant(tenant)}
              onTerminateContract={() => setTerminatingTenant(tenant)}
              onEditTenant={() => navigate(`/host/tenant-edit/${tenant.userId}`)}
            />
          ))}
        </div>
      )}

      {/* Tenant Detail Modal */}
      {selectedTenant && (
        <TenantDetail 
          tenant={selectedTenant} 
          onClose={() => setSelectedTenant(null)} 
          onUpdated={fetchTenants}
        />
      )}

      {/* Terminate Contract Modal */}
      {terminatingTenant && (
        <Modal
          title="Chấm dứt hợp đồng"
          onClose={() => setTerminatingTenant(null)}
          maxWidth="max-w-md"
        >
          <div className="p-6">
            <div className="text-center mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xác nhận chấm dứt hợp đồng
              </h3>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn chấm dứt hợp đồng thuê phòng của{" "}
                <span className="font-medium">{terminatingTenant.fullName}</span>?
              </p>
              {terminatingTenant.contractId && (
                <p className="text-sm text-gray-500 mt-2">
                  Mã hợp đồng: #{terminatingTenant.contractId}
                </p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Lưu ý:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Phòng {terminatingTenant.roomCode} sẽ được chuyển về trạng thái "Còn trống"</li>
                    <li>Hợp đồng sẽ được đánh dấu là đã chấm dứt</li>
                    <li>Người thuê sẽ được chuyển sang trạng thái không hoạt động</li>
                    <li>Thông tin sẽ được lưu trữ để tham khảo</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setTerminatingTenant(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => handleTerminateContract(terminatingTenant)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Xác nhận chấm dứt
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TenantList;