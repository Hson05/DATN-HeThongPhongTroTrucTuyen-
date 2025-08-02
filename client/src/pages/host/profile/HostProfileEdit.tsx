// 📁 src/pages/host/UpdateProfile.tsx
// Trang cập nhật thông tin cá nhân của chủ nhà
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hostService } from "../../../services/hostService";

interface UpdateProfileProps {
  closeModal?: () => void;
}

const UpdateProfile = ({ closeModal }: UpdateProfileProps) => {
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    email: "",
    avatar: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setInitialLoading(true);
    hostService.getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => alert("❌ Không thể tải thông tin profile!"))
      .finally(() => setInitialLoading(false));
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await hostService.updateProfile(profile);
      alert("✅ Cập nhật thành công!");
      if (closeModal) {
        closeModal();
      } else {
        navigate("/host/profile");
      }
    } catch (error) {
      alert("❌ Cập nhật thất bại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center text-blue-600">
        🧑‍💼 Cập nhật thông tin
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ tên:
          </label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại:
          </label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email:
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh đại diện (URL):
          </label>
          <input
            type="text"
            value={profile.avatar}
            onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {profile.avatar && (
          <div className="flex justify-center">
            <img
              src={profile.avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ:
          </label>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-between space-x-4 mt-6">
          {closeModal && (
            <button
              onClick={closeModal}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              ❌ Hủy
            </button>
          )}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "🔄 Đang lưu..." : "💾 Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;