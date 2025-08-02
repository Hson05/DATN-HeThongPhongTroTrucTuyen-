// 📁 src/pages/host/contract/ContractList.tsx
// TRANG DANH SÁCH HỢP ĐỒNG
import { useEffect, useState } from "react";
import { hostService } from "../../../services/hostService";
import { useNavigate } from "react-router-dom";
import { FileText, Search, Eye, Trash2 } from "lucide-react";

interface Contract {
  id: number;
  contractId: string;
  roomId: string;
  tenantId: string;
  tenantName?: string;
  contractDate: string;
  duration: number;
  rentPrice: number;
  terms: string;
  status?: string;
}

const ContractList = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRoomId, setFilterRoomId] = useState("");
  const navigate = useNavigate();

  const fetchContracts = async () => {
    try {
      setLoading(true);
      let res;
      if (filterRoomId) {
        res = await hostService.getContractsByRoom(filterRoomId);
      } else {
        res = await hostService.getContracts();
      }
      setContracts(res.data);
      setFilteredContracts(res.data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [filterRoomId]);

  const handleDelete = async (contractId: string, contractDbId: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa hợp đồng này?");
    if (!confirmDelete) return;

    try {
      await hostService.terminateContract(contractId);
      await hostService.deleteContract(contractDbId.toString());
      alert("Đã xóa hợp đồng.");
      fetchContracts();
    } catch (error) {
      alert("Lỗi khi xóa hợp đồng!");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải danh sách hợp đồng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Danh sách hợp đồng</h1>
        <p className="text-gray-600">Quản lý tất cả hợp đồng thuê phòng</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400 w-4 h-4" />
            <label className="font-medium text-gray-700 text-sm">
              Lọc theo ID phòng:
            </label>
          </div>
          <input
            type="text"
            placeholder="Nhập mã phòng..."
            value={filterRoomId}
            onChange={(e) => setFilterRoomId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => setFilterRoomId("")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition"
          >
            Xóa lọc
          </button>
        </div>
      </div>

      {/* Contracts Table */}
      {contracts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có hợp đồng nào
          </h3>
          <p className="text-gray-500">
            Các hợp đồng thuê phòng sẽ hiển thị ở đây
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã hợp đồng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời hạn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{contract.contractId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contract.tenantName || contract.tenantId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.roomId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.contractDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.duration} tháng
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-600">
                        {contract.rentPrice != null ? contract.rentPrice.toLocaleString() : "0"}₫
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contract.status === 'Đã chấm dứt' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {contract.status || 'Đang hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/host/contracts/${contract.id}`)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Xem</span>
                        </button>
                        <button
                          onClick={() => handleDelete(contract.contractId, contract.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractList;