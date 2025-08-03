import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/host/HostDashboard";
import Profile from "./pages/host/profile/HostProfile";
import UpdateProfile from "./pages/host/profile/HostProfileEdit";
import CreateRoom from "./pages/host/room/RoomCreate";
import UpdateRoom from "./pages/host/room/RoomEdit";
import CreateContract from "./pages/host/contract/ContractCreate";
import ContractDetail from "./pages/host/contract/ContractDetail";
import RoomStatus from "./pages/host/room/RoomStatusOverview";
import RentalRequest from "./pages/host/booking/BookingRequestList";
import ContractList from "./pages/host/contract/ContractList";
import RoomList from "./pages/host/room/RoomList";
import TenantList from "./pages/host/tenant/TenantList";
import HomepageLayout from "./components/HomePageLayout";
import TenantEdit from "./pages/host/tenant/TenantEdit";
import InvoiceList from "./pages/host/Invoice/InvoiceList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomepageLayout />}>
          <Route index element={<Navigate to="/host/dashboard" replace />} />
          <Route path="/host/dashboard" element={<Dashboard />} />
          <Route path="/host/profile" element={<Profile />} />
          <Route path="/host/update-profile" element={<UpdateProfile />} />
          <Route path="/host/room-list" element={<RoomList />} />
          <Route path="/host/create-room" element={<CreateRoom />} />
          <Route path="/host/update-room/:id" element={<UpdateRoom />} />
          <Route path="/host/room-status" element={<RoomStatus />} />
          <Route path="/host/tenant-list" element={<TenantList />} />
          <Route path="/host/tenant-edit/:id" element={<TenantEdit />} />
          <Route path="/host/rental-request" element={<RentalRequest />} />
          <Route path="/host/create-contract" element={<CreateContract />} />
          <Route path="/host/contracts" element={<ContractList />} />
          <Route path="/host/contracts/:id" element={<ContractDetail />} />
          <Route path="/host/invoices"element={<InvoiceList />} />
          <Route path="/host/logout" element={<div className="p-6"><h1>Đăng xuất (chưa hoàn thành)</h1></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;