import { Routes, Route } from "react-router-dom";
import CreateTicketPage from "./pages/CreateTicket/CreateTicketPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ExtendedTicketDetailPage from "./pages/TicketDetail/ExtendedTicketDetailPage";
import SupportTicketPage from "./pages/SupportTicket/SupportTicketPage";
import LoginPage from "./pages/Login/LoginPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { UserRole } from "./types";
import './assets/styles/global.css';

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                } />
                <Route path="/create-ticket" element={
                    <ProtectedRoute>
                        <CreateTicketPage />
                    </ProtectedRoute>
                } />
                <Route path="/tickets/:ticketId" element={
                    <ProtectedRoute>
                        <ExtendedTicketDetailPage />
                    </ProtectedRoute>
                } />
                <Route path="/support/tickets" element={
                    <ProtectedRoute requiredRoles={[UserRole.SUPPORT, UserRole.ADMIN]}>
                        <SupportTicketPage />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
}

export default App;