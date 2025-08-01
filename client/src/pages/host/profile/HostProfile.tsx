// 📁 src/pages/host/Profile.tsx
import { useEffect, useState } from "react";
import { hostService } from "../../../services/hostService";
import { User, Phone, Mail, MapPin, Edit } from "lucide-react";
import Modal from "../../../components/Modal"; // Modal tự tạo
import UpdateProfile from "./HostProfileEdit"; // Form cập nhật thông tin

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    hostService
      .getProfile()
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false));
  }, []);

  const refreshProfile = () => {
    hostService.getProfile().then((res) => setProfile(res.data));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center space-x-6">
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
              <p className="text-blue-100">Chủ nhà</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Thông tin cá nhân
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Edit size={16} />
              <span>Chỉnh sửa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Họ tên</p>
                  <p className="font-medium text-gray-900">{profile.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium text-gray-900">{profile.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="font-medium text-gray-900">{profile.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal cập nhật */}
      {isEditing && (
        <Modal onClose={() => setIsEditing(false)}>
          <UpdateProfile
            closeModal={() => {
              setIsEditing(false);
              refreshProfile(); // sau khi cập nhật thì load lại
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Profile;
