// 📁 client/src/pages/host/tenant/TenantEdit.tsx
// Trang chỉnh sửa thông tin người thuê
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hostService } from "../../../services/hostService";

const TenantEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState({
    fullName: "",
    phone: "",
    email: "",
    roomCode: "",
    roomId: "",
    startDate: "",
    endDate: "",
    monthlyRent: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await hostService.getTenantById(id as string);
        setTenant(res.data);
      } catch (error) {
        alert("Không tìm thấy người thuê");
        console.error(error);
        navigate("/host/tenant-list");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTenant();
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTenant((prev) => ({
      ...prev,
      [name]: name === "monthlyRent" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hostService.updateTenant(id as string, tenant);
      alert("✅ Cập nhật thành công!");
      navigate("/host/tenant-list");
    } catch (error) {
      alert("❌ Lỗi khi cập nhật người thuê");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Chỉnh sửa người thuê</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="fullName" value={tenant.fullName} onChange={handleChange} placeholder="Họ tên" className="w-full p-2 border rounded" required />
        <input type="text" name="phone" value={tenant.phone} onChange={handleChange} placeholder="SĐT" className="w-full p-2 border rounded" required />
        <input type="email" name="email" value={tenant.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="text" name="roomCode" value={tenant.roomCode} onChange={handleChange} placeholder="Mã phòng (P101...)" className="w-full p-2 border rounded" required />
        <input type="text" name="roomId" value={tenant.roomId} onChange={handleChange} placeholder="ID phòng" className="w-full p-2 border rounded" required />
        <input type="date" name="startDate" value={tenant.startDate} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="date" name="endDate" value={tenant.endDate} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="monthlyRent" value={tenant.monthlyRent} onChange={handleChange} placeholder="Giá thuê hàng tháng" className="w-full p-2 border rounded" required />

        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => navigate("/host/tenant-list")} className="px-4 py-2 border rounded hover:bg-gray-50">
            Hủy
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default TenantEdit;
