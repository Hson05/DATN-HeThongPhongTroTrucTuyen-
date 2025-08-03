// 📁 client/src/services/hostService.ts
import axios from "axios";

const API = "http://localhost:3000";

// Invoice interface
export interface Invoice {
  id?: string;
  roomId: string;
  tenantName: string;
  roomPrice: number;
  electricityAmount: number;
  electricityRate: number;
  electricityTotal: number;
  waterAmount: number;
  waterRate: number;
  waterTotal: number;
  otherFees: number;
  otherFeesDescription: string;
  totalAmount: number;
  month: number;
  year: number;
  dueDate: string;
  createdDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
}

// Thêm interceptor để xử lý lỗi
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const hostService = {
  
  // 1. Cập nhật thông tin cá nhân
  getProfile: () => axios.get(`${API}/hosts/1`),
  updateProfile: (data: any) => axios.put(`${API}/hosts/1`, data),
  
  // 2. Quản lý trạng thái phòng
  getRoomStatus: () => axios.get(`${API}/roomStatus`),
  updateRoomStatus: (roomId: string, status: string) =>
    axios.patch(`${API}/roomStatus/${roomId}`, { status }),

  // 3. Duyệt yêu cầu thuê phòng
  getRentalRequests: () => axios.get(`${API}/rentalRequests`),
  approveRentalRequest: (id: string) =>
    axios.patch(`${API}/rentalRequests/${id}`, { status: "đã duyệt" }),
  rejectRentalRequest: (id: string) =>
    axios.patch(`${API}/rentalRequests/${id}`, { status: "từ chối" }),

  // 4. Tạo hợp đồng 
  createContract: (data: any) => axios.post(`${API}/contracts`, data),

  // 5. Quản lý hợp đồng
  getContracts: () => axios.get(`${API}/contracts`),
  getContractsByRoom: (roomId: string) => axios.get(`${API}/contracts?roomId=${roomId}`),
  getContractById: (id: string) => axios.get(`${API}/contracts/${id}`),
  deleteContract: (id: string) => axios.delete(`${API}/contracts/${id}`),

  // 6. Quản lý phòng
  createRoom: async (data: any) => {
    try {
      // Tạo ID mới cho phòng
      const newId = Date.now();
      
      // 1. Tạo phòng mới
      const roomRes = await axios.post(`${API}/rooms`, {
        id: newId,
        roomId: data.roomId,
        area: data.area,
        price: data.price,
        utilities: data.utilities,
        maxPeople: data.maxPeople,
        images: data.images,
        description: data.description,
        location: data.location,
        deposit: data.deposit,
        electricity: data.electricity,
        tenant: null
      });

      // 2. Tạo trạng thái phòng tương ứng
      await axios.post(`${API}/roomStatus`, {
        id: newId,
        roomId: data.roomId,
        name: `Phòng ${data.roomId}`,
        status: "Trống"
      });

      return roomRes;
    } catch (error) {
      console.error("❌ Lỗi tạo phòng:", error);
      throw error;
    }
  },

  getRooms: () => axios.get(`${API}/rooms`),
  getRoomById: (roomId: string) => {
    return axios.get(`${API}/rooms`).then(res => {
      const room = res.data.find((r: any) => r.roomId === roomId);
      if (!room) throw new Error("Không tìm thấy phòng");
      return { data: room };
    });
  },
  
  updateRoom: async (roomId: string, data: any) => {
    try {
      // 1. Tìm phòng theo roomId
      const roomsRes = await axios.get(`${API}/rooms`);
      const room = roomsRes.data.find((r: any) => r.roomId === roomId);
      if (!room) throw new Error("Không tìm thấy phòng");

      // 2. Cập nhật thông tin phòng
      const roomRes = await axios.put(`${API}/rooms/${room.id}`, {
        ...room,
        area: data.area,
        price: data.price,
        utilities: data.utilities,
        maxPeople: data.maxPeople,
        images: data.images,
        description: data.description,
        location: data.location,
        deposit: data.deposit,
        electricity: data.electricity
      });

      // 3. Cập nhật tên trong roomStatus
      const statusRes = await axios.get(`${API}/roomStatus`);
      const status = statusRes.data.find((s: any) => s.roomId === roomId);
      if (status) {
        await axios.patch(`${API}/roomStatus/${status.id}`, {
          name: `Phòng ${roomId}`
        });
      }

      return roomRes;
    } catch (error) {
      console.error("❌ Lỗi cập nhật phòng:", error);
      throw error;
    }
  },

  deleteRoom: async (roomId: string) => {
    try {
      // 1. Tìm phòng theo roomId
      const roomsRes = await axios.get(`${API}/rooms`);
      const room = roomsRes.data.find((r: any) => r.roomId === roomId);
      if (!room) throw new Error("Không tìm thấy phòng");

      // 2. Kiểm tra xem phòng có đang được thuê không
      if (room.tenant) {
        throw new Error("Không thể xóa phòng đang có người thuê!");
      }

      // 3. Xóa phòng
      await axios.delete(`${API}/rooms/${room.id}`);
      
      // 4. Xóa trạng thái phòng
      const statusRes = await axios.get(`${API}/roomStatus`);
      const status = statusRes.data.find((s: any) => s.roomId === roomId);
      if (status) {
        await axios.delete(`${API}/roomStatus/${status.id}`);
      }

      return { success: true };
    } catch (error) {
      console.error("❌ Lỗi xóa phòng:", error);
      throw error;
    }
  },

  // 7. Thống kê
  getStatistics: () => {
    return Promise.all([
      axios.get(`${API}/rooms`),
      axios.get(`${API}/roomStatus`),
      axios.get(`${API}/tenants?status_ne=inactive`)
    ]).then(([roomsRes, statusRes, tenantsRes]) => {
      const rooms = roomsRes.data;
      const roomStatus = statusRes.data;
      const tenants = tenantsRes.data;
      
      const totalRooms = rooms.length;
      const rentedRooms = roomStatus.filter((r: any) => r.status === "Đã cho thuê").length;
      const availableRooms = roomStatus.filter((r: any) => r.status === "Trống").length;
      const totalRevenue = tenants.reduce((sum: number, tenant: any) => sum + (tenant.monthlyRent || 0), 0);
      const totalTenants = tenants.length;

      return {
        data: {
          totalRooms,
          rentedRooms,
          availableRooms,
          totalRevenue,
          totalTenants
        }
      };
    });
  },

  // 8. Quản lý người thuê
  getTenants: () => axios.get(`${API}/tenants?status_ne=inactive`),
  getTenantById: (tenantId: string) => {
    return axios.get(`${API}/tenants`).then(res => {
      const tenant = res.data.find((t: any) => t.userId === tenantId);
      if (!tenant) throw new Error("Không tìm thấy người thuê");
      return { data: tenant };
    });
  },
  updateTenant: (tenantId: string, data: any) => {
    return axios.get(`${API}/tenants`).then(res => {
      const tenant = res.data.find((t: any) => t.userId === tenantId);
      if (!tenant) throw new Error("Không tìm thấy người thuê");
      return axios.put(`${API}/tenants/${tenant.id}`, { ...tenant, ...data });
    });
  },
  deleteTenant: (tenantId: string) => {
    return axios.get(`${API}/tenants`).then(res => {
      const tenant = res.data.find((t: any) => t.userId === tenantId);
      if (!tenant) throw new Error("Không tìm thấy người thuê");
      return axios.delete(`${API}/tenants/${tenant.id}`);
    });
  },

  // 9. Gắn người thuê vào phòng (sau khi duyệt yêu cầu)
  assignTenantToRoom: async (tenantData: {
    tenantName: string;
    phone: string;
    email: string;
    roomId: string;
    roomCode: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    contractId: string;
  }) => {
    try {
      const avatarUrl = `https://i.pravatar.cc/100?img=${Date.now() % 70 + 1}`;
      const userId = `U${Date.now()}`;

      // 1. Tạo người thuê mới
      const tenantRes = await axios.post(`${API}/tenants`, {
        userId: userId,
        fullName: tenantData.tenantName,
        phone: tenantData.phone,
        email: tenantData.email,
        avatar: avatarUrl,
        roomCode: tenantData.roomCode,
        roomId: tenantData.roomId,
        startDate: tenantData.startDate,
        endDate: tenantData.endDate,
        contractId: tenantData.contractId,
        monthlyRent: tenantData.monthlyRent,
        status: 'active'
      });

      // 2. Cập nhật trạng thái phòng thành "Đã cho thuê"
      const statusRes = await axios.get(`${API}/roomStatus`);
      const status = statusRes.data.find((s: any) => s.roomId === tenantData.roomId);
      if (status) {
        await axios.patch(`${API}/roomStatus/${status.id}`, { 
          status: "Đã cho thuê" 
        });
      }

      // 3. Cập nhật thông tin tenant trong phòng
      const roomsRes = await axios.get(`${API}/rooms`);
      const room = roomsRes.data.find((r: any) => r.roomId === tenantData.roomId);
      if (room) {
        await axios.patch(`${API}/rooms/${room.id}`, {
          tenant: {
            userId: userId,
            fullName: tenantData.tenantName,
            phone: tenantData.phone,
            avatar: avatarUrl
          }
        });
      }

      return tenantRes;
    } catch (error) {
      console.error("❌ Lỗi gắn người thuê vào phòng:", error);
      throw error;
    }
  },

  // 10. Chấm dứt hợp đồng/Trả phòng
  terminateContract: async (contractId: string) => {
  try {
    // Tìm hợp đồng theo contractId (không phải id)
    const contractsRes = await axios.get(`${API}/contracts`);
    const contract = contractsRes.data.find((c: any) => c.contractId === contractId);
    if (!contract) throw new Error("Không tìm thấy hợp đồng");

    const tenantsRes = await axios.get(`${API}/tenants?contractId=${contractId}&status_ne=inactive`);
    const tenant = tenantsRes.data[0];
    if (!tenant) throw new Error("Không tìm thấy người thuê tương ứng với hợp đồng");

    const statusRes = await axios.get(`${API}/roomStatus`);
    const status = statusRes.data.find((s: any) => s.roomId === tenant.roomId);
    if (status) {
      await axios.patch(`${API}/roomStatus/${status.id}`, { status: "Trống" });
    }

    const roomsRes = await axios.get(`${API}/rooms`);
    const room = roomsRes.data.find((r: any) => r.roomId === tenant.roomId);
    if (room) {
      await axios.patch(`${API}/rooms/${room.id}`, { tenant: null });
    }

    // ✅ Cập nhật hợp đồng theo contract.id
    await axios.patch(`${API}/contracts/${contract.id}`, {
      status: "Đã chấm dứt",
      terminatedDate: new Date().toISOString().split('T')[0]
    });

    await axios.patch(`${API}/tenants/${tenant.id}`, {
      status: "inactive",
      terminatedDate: new Date().toISOString().split("T")[0]
    });

    return { success: true, message: "Trả phòng thành công" };
  } catch (error) {
    console.error("❌ Lỗi chấm dứt hợp đồng:", error);
    throw error;
  }
},


  // 11. Duyệt yêu cầu với tạo hợp đồng và gắn người thuê
  approveRentalRequestWithContract: async (
    requestId: string,
    contractData: {
      roomId: string;
      tenantId: string;
      contractDate: string;
      duration: number;
      rentPrice: number;
      terms: string;
    }
  ) => {
    try {
      // 1. Lấy thông tin yêu cầu thuê
      const requestRes = await axios.get(`${API}/rentalRequests/${requestId}`);
      const request = requestRes.data;
      
      // 2. Lấy thông tin phòng
      const roomsRes = await axios.get(`${API}/rooms`);
      const room = roomsRes.data.find((r: any) => r.roomId === contractData.roomId);
      if (!room) throw new Error("Không tìm thấy phòng");

      // 3. Tạo ID cho hợp đồng
      const contractId = `C${Date.now()}`;
      
      // 4. Tạo hợp đồng
      await axios.post(`${API}/contracts`, {
        contractId: contractId,
        tenantName: request.tenantName,
        phone: request.phone,
        email: request.email,
        roomId: contractData.roomId,
        tenantId: contractData.tenantId,
        contractDate: contractData.contractDate,
        duration: contractData.duration,
        rentPrice: contractData.rentPrice,
        terms: contractData.terms,
        status: "active"
      });

      // 5. Tính ngày kết thúc hợp đồng
      const startDate = new Date(contractData.contractDate);
      const endDate = new Date(startDate.setMonth(startDate.getMonth() + contractData.duration));
      
      // 6. Gắn người thuê vào phòng
      await hostService.assignTenantToRoom({
        tenantName: request.tenantName,
        phone: request.phone,
        email: request.email,
        roomId: contractData.roomId,
        roomCode: contractData.roomId,
        startDate: contractData.contractDate,
        endDate: endDate.toISOString().split('T')[0],
        monthlyRent: contractData.rentPrice,
        contractId: contractId
      });

      // 7. Duyệt yêu cầu
      await axios.patch(`${API}/rentalRequests/${requestId}`, { 
        status: "đã duyệt" 
      });

      return { success: true, contractId };
    } catch (error) {
      console.error("❌ Lỗi duyệt yêu cầu và tạo hợp đồng:", error);
      throw error;
    }
  },

  // 12. Gia hạn hợp đồng
  extendContract: async (tenantId: string, months: number) => {
    try {
      // 1. Lấy thông tin người thuê hiện tại
      const tenantsRes = await axios.get(`${API}/tenants`);
      const tenant = tenantsRes.data.find((t: any) => t.userId === tenantId);

      if (!tenant || tenant.status === 'inactive') {
        throw new Error("Không tìm thấy người thuê hoặc hợp đồng đã chấm dứt");
      }

      // 2. Tính ngày kết thúc mới
      const currentEndDate = new Date(tenant.endDate);
      const newEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + months));

      // 3. Cập nhật ngày kết thúc hợp đồng cho người thuê
      await axios.patch(`${API}/tenants/${tenant.id}`, {
        endDate: newEndDate.toISOString().split('T')[0]
      });

      // 4. Cập nhật hợp đồng nếu có
      if (tenant.contractId) {
        const contractsRes = await axios.get(`${API}/contracts`);
        const contract = contractsRes.data.find((c: any) => c.contractId === tenant.contractId);
        if (contract) {
          await axios.patch(`${API}/contracts/${contract.id}`, {
            duration: contract.duration + months,
            extendedDate: new Date().toISOString().split('T')[0],
            extendedMonths: months
          });
        }
      }

      return { 
        success: true, 
        newEndDate: newEndDate.toISOString().split('T')[0],
        message: `Gia hạn thêm ${months} tháng thành công`
      };
    } catch (error) {
      console.error("❌ Lỗi gia hạn hợp đồng:", error);
      throw error;
    }
  },

  // 13. Lấy lịch sử hợp đồng (bao gồm cả đã chấm dứt)
  getContractHistory: () => axios.get(`${API}/contracts`),
  getContractHistoryByRoom: (roomId: string) => axios.get(`${API}/contracts?roomId=${roomId}`),
  
  // 14. Lấy danh sách người thuê cũ (đã trả phòng)
  getFormerTenants: () => axios.get(`${API}/tenants?status=inactive`),

  // 15. Quản lý hóa đơn
  getAllInvoices: async (): Promise<Invoice[]> => {
    try {
      const response = await fetch(`${API}/invoices`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  },

  createInvoice: async (invoiceData: Omit<Invoice, 'id'>): Promise<Invoice> => {
    try {
      const newInvoice = {
        ...invoiceData,
        id: Date.now().toString(),
        status: 'unpaid' as const,
      };

      const response = await fetch(`${API}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInvoice),
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  updateInvoiceStatus: async (id: string, status: Invoice['status']): Promise<Invoice> => {
    try {
      const response = await fetch(`${API}/invoices/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },

  deleteInvoice: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API}/invoices/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },
};