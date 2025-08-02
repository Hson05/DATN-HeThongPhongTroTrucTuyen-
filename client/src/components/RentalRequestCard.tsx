// src/components/RentalRequestCard.tsx
  // Thẻ hiển thị thông tin yêu cầu thuê phòng
  import { Calendar, Phone, MessageCircle } from "lucide-react";

  interface RentalRequest {
    requestId: string;
    tenantName: string;
    phone: string;
    email: string;
    desiredRoomId: string;
    status: string;
    message: string;
    submittedAt: string;
    avatar: string;
  }

  interface RentalRequestCardProps {
    request: RentalRequest;
    onApprove: () => void;
    onReject: () => void;
  }

  const RentalRequestCard = ({ request, onApprove, onReject }: RentalRequestCardProps) => (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center space-x-4">
        <img src={request.avatar} alt={request.tenantName} className="w-12 h-12 rounded-full" />
        <div>
          <div className="font-semibold">{request.tenantName}</div>
          <div className="text-sm text-gray-500">{request.phone}</div>
          <div className="text-sm text-gray-500">{request.email}</div>
          <div className="text-xs text-gray-400">{request.submittedAt}</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center space-x-2 mt-4 md:mt-0">
        <button onClick={onApprove} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Duyệt</button>
        <button onClick={onReject} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Từ chối</button>
      </div>
    </div>
  );

  export default RentalRequestCard;