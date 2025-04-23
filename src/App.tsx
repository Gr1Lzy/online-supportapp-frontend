import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import AppLayout from "./components/layout/AppLayout/AppLayout";
import CreateTicketPage from "./pages/CreateTicket/CreateTicketPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import TicketDetailPage from "./pages/TicketDetail/TicketDetailPage";
import SupportTicketPage from "./pages/SupportTicket/SupportTicketPage";
import LoginPage from "./pages/Login/LoginPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import AdminPage from "./pages/AdminPage/AdminPage";
import { UserRole } from "./types";
import './styles/index.css';

function App() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const isAuthPage = (path: string) => ['/login', '/admin/login', '/register'].includes(path);

    return (
        <AppLayout showHeader={isAuthenticated && !isAuthPage(window.location.pathname)}>
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
                        <TicketDetailPage />
                    </ProtectedRoute>
                } />
                <Route path="/support/tickets" element={
                    <ProtectedRoute requiredRoles={[UserRole.SUPPORT, UserRole.ADMIN]}>
                        <SupportTicketPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
                        <AdminPage />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AppLayout>
    );
}

export default App;